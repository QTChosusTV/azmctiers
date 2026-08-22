/// <reference types="vite/client" />

// This tells TypeScript: "Treat any .css import as a valid module"
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}