# SpecMaster: Technical Specification Builder

A professional-grade web application designed to help software architects and developers build high-quality Technical Specification Documents. 

## Features

- **Document Templates**: Choose between "New Project" or "Fix/Enhancement" templates.
- **Dynamic Sections**: Content adapts based on the selected specification type (e.g., Current vs. Proposed states for enhancements).
- **Rich Markdown Editor**: Support for standardized formatting and real-time previews.
- **Image Integration**: Direct support for pasting images from the clipboard into Markdown fields.
- **Master Database Tracking**: Robust sections for DDL/DML changes, complete table scripts, and package documentation.
- **Professional Export**: Live print-preview and PDF-ready output following enterprise document standards.

## Tech Stack

This application is built using modern web technologies:

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Exporting**: [Docx](https://docx.js.org/) & [React-Markdown](https://github.com/remarkjs/react-markdown)

## Getting Started

### Prerequisites

- **Node.js**: Version 18.x, 20.x, or 22.x (Recommended)
- **Package Manager**: npm, yarn, or pnpm

### Installation

1. Clone the repository (if applicable) or download the source code.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Build

Create an optimized production build:
```bash
npm run build
```
The output will be in the `/dist` directory.

## Deployment Instructions

### Option 1: AI Studio (Current Environment)
You can directly share the application or deploy it to Google Cloud Run via the **Share** or **Settings** menu in the AI Studio interface.

### Option 2: Static Hosting (Vercel, Netlify, GitHub Pages)
Since this is a client-side Single Page Application (SPA):
1. Build the app using `npm run build`.
2. Connect your repository to your hosting provider.
3. Set the build command to `npm run build` and the output directory to `dist`.

### Option 3: Custom Server
The project includes a `package.json` with build scripts. You can serve the contents of the `dist` folder using any web server (Nginx, Apache, or a simple Node.js static server).

## Note on Angular
Please note that this application is built with **React**, not Angular. It uses modern functional component patterns and React 19 features for high performance and clean code.

## License
MIT (or as specified by user)
