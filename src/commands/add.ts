import path from "path";
import inquirer from "inquirer";
import ora from "ora";
import { logger } from "../utils/logger.js";
import { fs_utils } from "../utils/fs.js";
import { github } from "../utils/github.js";
import { dependencies } from "../utils/installer.js";

export async function addCommand(
  component?: string,
  options: any = {}
): Promise<void> {
  const { directory, all, installDeps = false } = options;
  const componentsDir = path.join(process.cwd(), directory);
  const utilsDir = path.join(process.cwd(), "lib");

  // Fetch available components from GitHub
  const spinner = ora("Fetching available components...").start();
  let availableComponents: string[] = [];

  try {
    availableComponents = await github.getAvailableComponents();
    spinner.succeed("Components fetched successfully");
  } catch (error) {
    spinner.fail("Failed to fetch components");
    logger.error(`Error: ${error}`);
    return;
  }

  // If --all flag is used, add all components
  if (all) {
    const allSpinner = ora("Adding all components...").start();

    try {
      // Make sure utils are in place first
      fs_utils.ensureDir(utilsDir);
      const requiredDeps = await github.downloadUtil("cn", utilsDir);

      // Download all components
      const allDependencies = new Set<string>(requiredDeps);

      for (const comp of availableComponents) {
        const compDeps = await github.downloadComponent(comp, componentsDir);
        compDeps.forEach((dep) => allDependencies.add(dep));
      }

      allSpinner.succeed("All components added successfully!");

      // Show dependencies needed
      const depsArray = Array.from(allDependencies);
      logger.info("Required dependencies:");
      logger.info(depsArray.join(", "));

      // Install dependencies if requested
      if (installDeps) {
        await dependencies.install(depsArray);
      } else {
        const { shouldInstall } = await inquirer.prompt([
          {
            type: "confirm",
            name: "shouldInstall",
            message: "Would you like to install the required dependencies now?",
            default: true,
          },
        ]);

        if (shouldInstall) {
          await dependencies.install(depsArray);
        }
      }
    } catch (error) {
      allSpinner.fail("Failed to add all components");
      logger.error(`Error: ${error}`);
    }

    return;
  }

  // If no component specified, show selection prompt
  if (!component) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "component",
        message: "Which component would you like to add?",
        choices: availableComponents,
      },
    ]);

    component = answers.component as string;
  }

  // Validate component
  if (!availableComponents.includes(component)) {
    logger.error(
      `Component "${component}" not found. Available components: ${availableComponents.join(
        ", "
      )}`
    );
    return;
  }

  // Install the selected component
  const componentSpinner = ora(`Adding ${component} component...`).start();

  try {
    // Make sure utils are in place first
    fs_utils.ensureDir(utilsDir);
    const utilDeps = await github.downloadUtil("cn", utilsDir);

    // Download the component
    fs_utils.ensureDir(componentsDir);
    const componentDeps = await github.downloadComponent(
      component,
      componentsDir
    );

    // Combine dependencies
    const allDeps = new Set<string>([...utilDeps, ...componentDeps]);
    const depsArray = Array.from(allDeps);

    componentSpinner.succeed(`${component} component added successfully!`);

    // Show dependencies needed
    logger.info("Required dependencies:");
    logger.info(depsArray.join(", "));

    // Install dependencies if requested
    if (installDeps) {
      await dependencies.install(depsArray);
    } else {
      const { shouldInstall } = await inquirer.prompt([
        {
          type: "confirm",
          name: "shouldInstall",
          message: "Would you like to install the required dependencies now?",
          default: true,
        },
      ]);

      if (shouldInstall) {
        await dependencies.install(depsArray);
      }
    }
  } catch (error) {
    componentSpinner.fail(`Failed to add ${component} component`);
    logger.error(`Error: ${error}`);
  }
}
