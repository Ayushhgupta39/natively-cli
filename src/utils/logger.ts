import chalk from "chalk";

export const logger = {
  welcome: () => {
    console.log(chalk.bold("\n🚀 Natively CLI\n"));
  },
  info: (message: string) => {
    console.log(chalk.blue(`ℹ️ ${message}`));
  },
  success: (message: string) => {
    console.log(chalk.green(`✅ ${message}`));
  },
  warning: (message: string) => {
    console.log(chalk.yellow(`⚠️ ${message}`));
  },
  error: (message: string) => {
    console.log(chalk.red(`❌ ${message}`));
  },
};
