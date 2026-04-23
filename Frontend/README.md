# FlowTrack Frontend

A modern React application built with Vite, featuring Material UI components and Tailwind CSS for styling.

## Tech Stack

- **React 19.2.5** - UI library
- **Vite 8.0.10** - Fast build tool and dev server with HMR
- **Material UI (MUI) 9.0.0** - Comprehensive component library
- **Tailwind CSS 4.2.4** - Utility-first CSS framework
- **Emotion 11.14.0** - CSS-in-JS styling solution (required for MUI)
- **PostCSS 8.5.10** - CSS processing
- **Autoprefixer 10.5.0** - Automatic vendor prefixes

## Available Plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) - Uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) - Uses [SWC](https://swc.rs/)

## Getting Started

### Installation

All dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview the production build

## Styling

This project uses **both** MUI and **Tailwind CSS**:

- **Material UI (MUI)**: For pre-built components and complex UI elements
- **Tailwind CSS**: For utility-based custom styling and layout

### Using MUI

```jsx
import { Button, Card, TextField } from '@mui/material';

export default function MyComponent() {
  return (
    <Card>
      <TextField label="Enter text" />
      <Button variant="contained">Submit</Button>
    </Card>
  );
}
```

### Using Tailwind CSS

```jsx
export default function MyComponent() {
  return (
    <div className="p-4 bg-blue-500 rounded-lg">
      <p className="text-white text-lg font-bold">Hello World</p>
    </div>
  );
}
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
