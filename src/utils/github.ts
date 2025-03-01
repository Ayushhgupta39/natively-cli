import fs from "fs-extra";
import path from "path";
import { logger } from "./logger";

const REPO_URL =
  "https://raw.githubusercontent.com/your-username/natively-components/main";

export const github = {
  /**
   * Fetch a file from GitHub repository
   */
  async fetchFile(filePath: string): Promise<string> {
    try {
      const response = await fetch(`${REPO_URL}/${filePath}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      logger.error(`Failed to fetch file from GitHub: ${filePath}`);
      throw error;
    }
  },

  /**
   * Get the list of available components from GitHub
   */
  async getAvailableComponents(): Promise<string[]> {
    try {
      // This is a simplified approach. In a real implementation,
      // you might want to fetch a components.json or similar
      // For now, we'll return a hardcoded list
      return ["button", "card", "input", "checkbox", "switch"];
    } catch (error) {
      logger.error("Failed to fetch available components list");
      logger.info("Falling back to default components list");
      return ["button"]; // Fallback to just button
    }
  },

  /**
   * Download a component from GitHub
   */
  async downloadComponent(
    component: string,
    targetDir: string
  ): Promise<string[]> {
    try {
      fs.ensureDirSync(targetDir);

      const componentContent = await github.fetchFile(
        `components/${component}/index.tsx`
      );
      fs.writeFileSync(
        path.join(targetDir, `${component}.tsx`),
        componentContent
      );

      let dependencies: string[] = [];

      // Fetch types file if it exists
      try {
        const typesContent = await github.fetchFile(
          `components/${component}/types.ts`
        );
        fs.writeFileSync(
          path.join(targetDir, `${component}.types.ts`),
          typesContent
        );
        dependencies.push(`${component}.types.ts`);
      } catch (error) {
        logger.info(`No separate types file found for ${component}`);
      }

      logger.success(`Component ${component} downloaded successfully`);

      return dependencies; // Ensure it returns an array
    } catch (error) {
      logger.error(`Failed to download component ${component}`);
      throw error;
    }
  },
  async downloadUtil(utilName: string, targetDir: string): Promise<string[]> {
    try {
      fs.ensureDirSync(targetDir);

      const utilContent = await github.fetchFile(`utils/${utilName}.ts`);
      fs.writeFileSync(path.join(targetDir, `${utilName}.ts`), utilContent);

      logger.success(`Utility ${utilName} downloaded successfully`);

      return [utilName]; // Return as an array to match expected usage
    } catch (error) {
      logger.error(`Failed to download utility ${utilName}`);
      throw error;
    }
  },
};
