#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const add_1 = require("./commands/add");
const init_1 = require("./commands/init");
const logger_1 = require("./utils/logger");
// Print a welcome message
logger_1.logger.welcome();
const program = new commander_1.Command();
program
    .name("natively")
    .description("A React Native UI component library CLI.")
    .version("0.1.0");
// Init command - initializes the library in a project
program
    .command("init")
    .description("Initialize the component library in your project")
    .action(init_1.initCommand);
// Add command - adds components to the project
program
    .command("add")
    .description("Add a component to your project")
    .argument("[component]", "The component to add")
    .option("-d, --directory <directory>", "The directory to add the component to", "components/ui")
    .option("-a, --all", "Add all components")
    .action(add_1.addCommand);
program.parse();
