import path from "path";
import inquirer from "inquirer";
import { logger } from "../utils/logger.js";
import { fs_utils } from "../utils/fs.js";
import { github } from "../utils/github.js";
import { dependencies } from "../utils/installer.js";

export async function initCommand(): Promise<void> {
  logger.info("Initializing React Native UI components...");

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is your project name?",
      default: "my-native-app",
    },
    {
      type: "confirm",
      name: "setupUtils",
      message: "Do you want to set up utility functions (cn, etc.)?",
      default: true,
    },
  ]);

  // Create components directory
  const componentsDir = path.join(process.cwd(), "components", "ui");
  fs_utils.ensureDir(componentsDir);

  // Create utils directory if user wants utility functions
  if (answers.setupUtils) {
    const utilsDir = path.join(process.cwd(), "lib");
    fs_utils.ensureDir(utilsDir);

    try {
      // Download utils.ts from repository
      const deps = await github.downloadUtil("utils", utilsDir);

      logger.info("Required dependencies for utilities:");
      logger.info(deps.join(", "));

      const { shouldInstall } = await inquirer.prompt([
        {
          type: "confirm",
          name: "shouldInstall",
          message: "Would you like to install the required dependencies now?",
          default: true,
        },
      ]);

      if (shouldInstall) {
        await dependencies.install(deps);
      }
    } catch (error) {
      logger.error(
        "Failed to download utility functions. Creating default version."
      );

      // Create utility function file
      fs_utils.writeFile(
        path.join(utilsDir, "utils.ts"),
        `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
      );

      logger.info("Don't forget to install required dependencies:");
      logger.info("npm install clsx tailwind-merge");
    }
  }

  logger.success("Initialization complete!");
}
