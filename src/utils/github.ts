import fs from "fs-extra";
import path from "path";
import { logger } from "./logger.js";

// Update the repository URL to your actual GitHub repo
const REPO_BASE_URL =
  "https://raw.githubusercontent.com/Ayushhgupta39/natively-ui/main";

export const github = {
  /**
   * Fetch a file from GitHub repository
   */
  async fetchFile(filePath: string): Promise<string> {
    try {
      const url = `${REPO_BASE_URL}/${filePath}`;
      const response = await fetch(url);

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
      // In a production implementation, you'd fetch a components.json or list the directory
      // For now, return the components you have available
      return ["button", "card"];
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

      // Update path to match your repository structure
      const componentPath = `apps/mobile/components/ui/${component}.tsx`;

      try {
        const componentContent = await github.fetchFile(componentPath);
        fs.writeFileSync(
          path.join(targetDir, `${component}.tsx`),
          componentContent
        );
        logger.success(`Component ${component} downloaded successfully`);
      } catch (error) {
        logger.error(`Failed to fetch component ${component}`);
        throw error;
      }

      // Determine dependencies based on component
      let dependencies: string[] = [];

      // For now, all components need these base dependencies
      dependencies.push("clsx", "tailwind-merge");

      // Add component-specific dependencies
      if (component === "button") {
        dependencies.push("react-native", "expo-router");
      } else if (component === "card") {
        dependencies.push("react-native");
      }

      return dependencies;
    } catch (error) {
      logger.error(`Failed to download component ${component}`);
      throw error;
    }
  },

  /**
   * Download a utility from GitHub
   */
  async downloadUtil(utilName: string, targetDir: string): Promise<string[]> {
    try {
      fs.ensureDirSync(targetDir);

      // Update path to match your repository structure
      const utilPath = `apps/mobile/lib/${utilName}.ts`;

      try {
        const utilContent = await github.fetchFile(utilPath);
        fs.writeFileSync(path.join(targetDir, `${utilName}.ts`), utilContent);
        logger.success(`Utility ${utilName} downloaded successfully`);
      } catch (error) {
        logger.error(`Failed to fetch utility ${utilName}`);
        throw error;
      }

      // Return dependencies for this utility
      if (utilName === "utils") {
        return ["clsx", "tailwind-merge"];
      }

      return [];
    } catch (error) {
      logger.error(`Failed to download utility ${utilName}`);
      throw error;
    }
  },
};
