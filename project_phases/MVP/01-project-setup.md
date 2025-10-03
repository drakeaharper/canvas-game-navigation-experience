# Ticket 01: Project Setup and Configuration

## Objective
Set up the development environment with Phaser 3, TypeScript, and Vite to enable rapid game development.

## Tasks

### 1. Initialize npm Project
```bash
npm init -y
```

### 2. Install Dependencies
```bash
# Core dependencies
npm install phaser@^3.80.0

# Dev dependencies
npm install -D typescript vite @types/node

# Optional: Type definitions for better IDE support
npm install -D @types/phaser
```

### 3. Create TypeScript Configuration
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Create Vite Configuration
Create `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

### 5. Create Project Structure
```
src/
├── main.ts              # Entry point
├── game.ts              # Phaser game configuration
├── scenes/
│   ├── PreloadScene.ts  # Asset loading
│   └── GameScene.ts     # Main game scene
├── sprites/
│   └── Player.ts        # Player character class
└── types/
    └── index.ts         # Custom type definitions

public/
└── assets/
    └── characters/      # Copy character sprites here
        └── player/

index.html               # HTML entry point
```

### 6. Create HTML Entry Point
Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas Course World - MVP</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #2d2d2d;
        }
        #game-container {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### 7. Update package.json Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### 8. Copy Character Assets
Copy character sprites from `initial-assets/` to `public/assets/characters/player/`:
- Copy all rotation PNGs
- Copy all walk animation PNGs
- Copy metadata.json (for reference)

### 9. Create .gitignore
```
node_modules/
dist/
.DS_Store
*.log
.env
.vscode/
```

## Acceptance Criteria
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts development server on port 3000
- [ ] TypeScript compilation works without errors
- [ ] Project structure is created
- [ ] Character assets are in `public/assets/characters/player/`
- [ ] Browser opens and shows blank page (no console errors)

## Dependencies
None - this is the foundation ticket

## Estimated Time
30-45 minutes
