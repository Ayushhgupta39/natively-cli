"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const logger_1 = require("../utils/logger");
const fs_1 = require("../utils/fs");
async function initCommand() {
    logger_1.logger.info("Initializing React Native UI components...");
    const answers = await inquirer_1.default.prompt([
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
    const componentsDir = path_1.default.join(process.cwd(), "components", "ui");
    fs_1.fs_utils.ensureDir(componentsDir);
    // Create utils directory if user wants utility functions
    if (answers.setupUtils) {
        const utilsDir = path_1.default.join(process.cwd(), "lib");
        fs_1.fs_utils.ensureDir(utilsDir);
        // Create utility function file
        fs_1.fs_utils.writeFile(path_1.default.join(utilsDir, "utils.ts"), `import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`);
        logger_1.logger.info("Don't forget to install required dependencies:");
        logger_1.logger.info("npm install clsx tailwind-merge");
    }
    logger_1.logger.success("Initialization complete!");
}
