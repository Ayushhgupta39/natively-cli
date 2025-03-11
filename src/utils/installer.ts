import { exec } from "child_process";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { logger } from "./logger.js";

export const dependencies = {
  /**
   * Detect the package manager used in the project
   */
  async detectPackageManager(): Promise<"npm" | "yarn" | "pnpm" | null> {
    // Check for lock files to determine which package manager is being used
    const cwd = process.cwd();

    if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
      return "yarn";
    }

    if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
      return "pnpm";
    }

    if (fs.existsSync(path.join(cwd, "package-lock.json"))) {
      return "npm";
    }

    return null; // No lock file found
  },

  /**
   * Check if a package manager is available in the system
   */
  async checkPackageManager(
    manager: "npm" | "yarn" | "pnpm"
  ): Promise<boolean> {
    try {
      await new Promise((resolve, reject) => {
        exec(`${manager} --version`, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(null);
          }
        });
      });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Let user choose a package manager
   */
  async choosePackageManager(): Promise<"npm" | "yarn" | "pnpm"> {
    // First try to detect from project
    const detected = await dependencies.detectPackageManager();

    if (detected) {
      const { useDetected } = await inquirer.prompt([
        {
          type: "confirm",
          name: "useDetected",
          message: `Detected ${detected} as your package manager. Use it?`,
          default: true,
        },
      ]);

      if (useDetected) {
        return detected;
      }
    }

    // Find available package managers
    const managers = [];
    if (await dependencies.checkPackageManager("npm")) managers.push("npm");
    if (await dependencies.checkPackageManager("yarn")) managers.push("yarn");
    if (await dependencies.checkPackageManager("pnpm")) managers.push("pnpm");

    // If only one is available, use it
    if (managers.length === 1) {
      return managers[0] as "npm" | "yarn" | "pnpm";
    }

    // If multiple are available, let user choose
    if (managers.length > 1) {
      const { manager } = await inquirer.prompt([
        {
          type: "list",
          name: "manager",
          message: "Which package manager would you like to use?",
          choices: managers,
          default: managers.includes("npm") ? "npm" : managers[0],
        },
      ]);

      return manager;
    }

    // If none are available, default to npm
    logger.warning("No package manager detected. Defaulting to npm.");
    return "npm";
  },

  /**
   * Install dependencies
   */
  async install(deps: string[]): Promise<boolean> {
    if (deps.length === 0) {
      logger.info("No dependencies to install");
      return true;
    }

    const pkgManager = await dependencies.choosePackageManager();

    const spinner = ora(
      `Installing dependencies with ${pkgManager}...`
    ).start();

    try {
      let command: string;

      switch (pkgManager) {
        case "yarn":
          command = `yarn add ${deps.join(" ")}`;
          break;
        case "pnpm":
          command = `pnpm add ${deps.join(" ")}`;
          break;
        default:
          command = `npm install ${deps.join(" ")}`;
      }

      await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve(null);
          }
        });
      });

      spinner.succeed("Dependencies installed successfully");
      return true;
    } catch (error) {
      spinner.fail("Failed to install dependencies");
      logger.error(`Error: ${error}`);
      logger.info("Please install dependencies manually:");
      logger.info(`${pkgManager} add ` + deps.join(" "));
      return false;
    }
  },
};
