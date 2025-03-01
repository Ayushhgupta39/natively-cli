import fs from "fs-extra";
import path from "path";
import { logger } from "./logger";

export const fs_utils = {
  // Check if a file or directory exists
  exists: (filePath: string): boolean => {
    return fs.existsSync(filePath);
  },

  // Create directory if it doesn't exist
  ensureDir: (dirPath: string): void => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`Created directory: ${dirPath}`);
    }
  },

  // Write content to a file
  writeFile: (filePath: string, content: string): void => {
    try {
      fs.writeFileSync(filePath, content);
      logger.success(`Created file: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to write file: ${filePath}`);
      throw error;
    }
  },

  // Copy a template file to destination
  copyTemplate: (
    templatePath: string,
    destPath: string,
    replacements?: Record<string, string>
  ): void => {
    try {
      let content = fs.readFileSync(templatePath, "utf8");

      // Replace placeholders if provided
      if (replacements) {
        Object.entries(replacements).forEach(([key, value]) => {
          content = content.replace(
            new RegExp(`\\{\\{${key}\\}\\}`, "g"),
            value
          );
        });
      }

      // Ensure the destination directory exists
      const dir = path.dirname(destPath);
      fs.ensureDirSync(dir);

      // Write the file
      fs.writeFileSync(destPath, content);
      logger.success(`Created file: ${destPath}`);
    } catch (error) {
      logger.error(`Failed to copy template: ${templatePath}`);
      throw error;
    }
  },
};
