"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fs_utils = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
exports.fs_utils = {
    // Check if a file or directory exists
    exists: (filePath) => {
        return fs_extra_1.default.existsSync(filePath);
    },
    // Create directory if it doesn't exist
    ensureDir: (dirPath) => {
        if (!fs_extra_1.default.existsSync(dirPath)) {
            fs_extra_1.default.mkdirSync(dirPath, { recursive: true });
            logger_1.logger.info(`Created directory: ${dirPath}`);
        }
    },
    // Write content to a file
    writeFile: (filePath, content) => {
        try {
            fs_extra_1.default.writeFileSync(filePath, content);
            logger_1.logger.success(`Created file: ${filePath}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to write file: ${filePath}`);
            throw error;
        }
    },
    // Copy a template file to destination
    copyTemplate: (templatePath, destPath, replacements) => {
        try {
            let content = fs_extra_1.default.readFileSync(templatePath, "utf8");
            // Replace placeholders if provided
            if (replacements) {
                Object.entries(replacements).forEach(([key, value]) => {
                    content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
                });
            }
            // Ensure the destination directory exists
            const dir = path_1.default.dirname(destPath);
            fs_extra_1.default.ensureDirSync(dir);
            // Write the file
            fs_extra_1.default.writeFileSync(destPath, content);
            logger_1.logger.success(`Created file: ${destPath}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to copy template: ${templatePath}`);
            throw error;
        }
    },
};
