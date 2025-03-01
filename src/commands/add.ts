import path from "path";
import inquirer from "inquirer";
import ora from "ora";
import { logger } from "../utils/logger";
import { fs_utils } from "../utils/fs";

// List of available components
const AVAILABLE_COMPONENTS = [
  "button",
  "card",
  "input",
  "checkbox",
  "switch",
  "modal",
  // Will add more components as we build them
];

export async function addCommand(
  component?: string,
  options: any = {}
): Promise<void> {
  const { directory, all } = options;

  // If --all flag is used, add all components
  if (all) {
    const spinner = ora("Adding all components...").start();

    try {
      for (const comp of AVAILABLE_COMPONENTS) {
        await installComponent(comp, directory);
      }

      spinner.succeed("All components added successfully!");
    } catch (error) {
      spinner.fail("Failed to add all components");
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
        choices: AVAILABLE_COMPONENTS,
      },
    ]);

    component = answers.component as string;
  }

  // Validate component
  if (!AVAILABLE_COMPONENTS.includes(component)) {
    logger.error(
      `Component "${component}" not found. Available components: ${AVAILABLE_COMPONENTS.join(
        ", "
      )}`
    );
    return;
  }

  // Install the selected component
  const spinner = ora(`Adding ${component} ...`).start();

  try {
    await installComponent(component, directory);
    spinner.succeed(`${component} component added successfully!`);
  } catch (error) {
    spinner.fail(`Failed to add ${component} component`);
    logger.error(`Error: ${error}`);
  }
}

async function installComponent(
  component: string,
  directory: string
): Promise<void> {
  // This is where you'd typically fetch from a remote repository
  // For now, let's use local template files

  // For this example, we'll just create a simple component file
  const componentDir = path.join(process.cwd(), directory);
  fs_utils.ensureDir(componentDir);

  // Check for utils function
  const utilsPath = path.join(process.cwd(), "lib", "utils.ts");
  const hasUtils = fs_utils.exists(utilsPath);

  if (!hasUtils) {
    logger.warning(
      'Utils functions not found. Run "natively init" first or create lib/utils.ts manually.'
    );
  }

  // Create the component file based on the component name
  let componentContent = "";

  switch (component) {
    case "button":
      componentContent = `import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';
${
  hasUtils
    ? "import { cn } from '../../lib/utils';"
    : "// Import cn utility once available"
}

export interface ButtonProps extends PressableProps {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

export const Button = ({
  variant = 'default',
  size = 'default',
  className,
  textClassName,
  children,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      className={${hasUtils ? "cn(" : ""}
        'flex-row items-center justify-center rounded-md',
        variant === 'default' && 'bg-primary',
        variant === 'destructive' && 'bg-destructive',
        variant === 'outline' && 'border border-input',
        size === 'default' && 'px-4 py-2',
        size === 'sm' && 'px-3 py-1',
        size === 'lg' && 'px-6 py-3',
        className
      ${hasUtils ? ")" : ""}}
      {...props}
    >
      <Text
        className={${hasUtils ? "cn(" : ""}
          'text-sm font-medium',
          variant === 'default' && 'text-primary-foreground',
          variant === 'destructive' && 'text-destructive-foreground',
          variant === 'outline' && 'text-foreground',
          textClassName
        ${hasUtils ? ")" : ""}}
      >
        {children}
      </Text>
    </Pressable>
  );
};
`;
      break;

    // Add more component templates here

    default:
      componentContent = `import React from 'react';
import { View, Text } from 'react-native';
${
  hasUtils
    ? "import { cn } from '../../lib/utils';"
    : "// Import cn utility once available"
}

export interface ${
        component.charAt(0).toUpperCase() + component.slice(1)
      }Props {
  className?: string;
}

export const ${component.charAt(0).toUpperCase() + component.slice(1)} = ({ 
  className,
  ...props
}: ${component.charAt(0).toUpperCase() + component.slice(1)}Props) => {
  return (
    <View 
      className={${hasUtils ? "cn(" : ""}"p-4", className${hasUtils ? ")" : ""}}
      {...props}
    >
      <Text>This is a ${component} component</Text>
    </View>
  );
};
`;
  }

  fs_utils.writeFile(
    path.join(componentDir, `${component}.tsx`),
    componentContent
  );
}
