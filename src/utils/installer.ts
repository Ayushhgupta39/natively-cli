import { exec } from "child_process";
import ora from "ora";
import { logger } from "./logger.js";

export const dependencies = {
  /**
   * Check if a package manager is available
   */
  async checkPackageManager(): Promise<"npm" | "yarn" | "pnpm" | null> {
    try {
      // Check for yarn first
      await new Promise((resolve, reject) => {
        exec("yarn --version", (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(null);
          }
        });
      });
      return "yarn";
    } catch {
      try {
        // Then check for pnpm
        await new Promise((resolve, reject) => {
          exec("pnpm --version", (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(null);
            }
          });
        });
        return "pnpm";
      } catch {
        try {
          // Finally check for npm
          await new Promise((resolve, reject) => {
            exec("npm --version", (error) => {
              if (error) {
                reject(error);
              } else {
                resolve(null);
              }
            });
          });
          return "npm";
        } catch {
          return null;
        }
      }
    }
  },

  /**
   * Install dependencies
   */
  async install(deps: string[]): Promise<boolean> {
    if (deps.length === 0) {
      logger.info("No dependencies to install");
      return true;
    }

    const pkgManager = await dependencies.checkPackageManager();

    if (!pkgManager) {
      logger.error(
        "No package manager found. Please install dependencies manually:"
      );
      logger.info("npm install " + deps.join(" "));
      return false;
    }

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
