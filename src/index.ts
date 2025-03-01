#!/usr/bin/env node

import { Command } from "commander";
import { addCommand } from "./commands/add";
import { initCommand } from "./commands/init";
import { logger } from "./utils/logger";

// Print a welcome message
logger.welcome();

const program = new Command();

program
  .name("natively")
  .description("A React Native UI component library CLI.")
  .version("0.1.0");

// Init command - initializes the library in a project
program
  .command("init")
  .description("Initialize the component library in your project")
  .action(initCommand);

// Add command - adds components to the project
program
  .command("add")
  .description("Add a component to your project")
  .argument("[component]", "The component to add")
  .option(
    "-d, --directory <directory>",
    "The directory to add the component to",
    "components/ui"
  )
  .option("-a, --all", "Add all components")
  .option("-i, --install-deps", "Install dependencies automatically")
  .action(addCommand);

program.parse();
