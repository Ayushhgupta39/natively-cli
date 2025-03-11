# Nativly CLI

A React Native UI component library CLI inspired by [shadcn/ui](https://ui.shadcn.com/), allowing you to easily add Tailwind-powered components to your React Native projects.

## ✨ Features

- 🚀 Simple installation of React Native UI components
- 🎨 Uses Tailwind CSS with NativeWind for styling
- ⚡ Zero runtime, just copy-paste code
- 🔌 Works perfectly with Expo
- ✅ TypeScript support out of the box

## 🚀 Getting Started

### 1. Initialize Nativly in your project
You don't need to install anything! Just use `npx`:

```bash
npx nativly init
```

This sets up the required utility functions and creates the component directory structure.

### 2. Add components

```bash
npx nativly add button
```

Or add all available components:

```bash
npx nativly add --all
```

### 3. Use the components in your app

```jsx
import { Button } from "@/components/ui/button";

export default function MyScreen() {
  return (
    <Button onPress={() => console.log("Button pressed")}>
      Click Me
    </Button>
  );
}
```

## 📜 Available Commands

### `init`
Initialize the component library in your project:

```bash
npx nativly init
```

### `add`
Add components to your project:

```bash
npx nativly add [component]
```

#### Options:

- `-d, --directory <directory>`: Specify the directory to add the component to (default: `components/ui`)
- `-a, --all`: Add all available components
- `-i, --install-deps`: Install dependencies automatically

## 📌 Available Components
Just a simple Button as of now :)

- `Button`

- More coming super soon!

## 📦 Dependencies

Nativly requires the following dependencies:

- `react-native`
- `nativewind` (or similar setup for Tailwind CSS in React Native)
- `tailwind-merge`
- `clsx`

The CLI will automatically prompt you to install any required dependencies.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 👨‍💻 Credits

Created by **Ayush Gupta**. Inspired by [shadcn/ui](https://ui.shadcn.com/).