# Ticket 02: Create Grass Field Scene

## Objective
Set up the basic Phaser game instance and create a simple grassy field scene where gameplay will take place.

## Tasks

### 1. Create Game Configuration (`src/game.ts`)
```typescript
import Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene'
import GameScene from './scenes/GameScene'

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL with Canvas fallback
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#87CEEB', // Sky blue
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Top-down game, no gravity
      debug: false // Set to true for development
    }
  },
  scene: [PreloadScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true, // Crisp pixel art rendering
  render: {
    antialias: false
  }
}

export default gameConfig
```

### 2. Create Main Entry Point (`src/main.ts`)
```typescript
import Phaser from 'phaser'
import gameConfig from './game'

window.addEventListener('load', () => {
  const game = new Phaser.Game(gameConfig)

  // Make game available globally for debugging
  ;(window as any).game = game
})
```

### 3. Create Preload Scene (`src/scenes/PreloadScene.ts`)
```typescript
import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // Create loading text
    const centerX = this.cameras.main.centerX
    const centerY = this.cameras.main.centerY

    const loadingText = this.add.text(centerX, centerY, 'Loading...', {
      fontSize: '24px',
      color: '#ffffff'
    })
    loadingText.setOrigin(0.5)

    // TODO: Load assets here (will be added in next tickets)

    // For now, create a simple grass texture programmatically
    this.createGrassTexture()
  }

  private createGrassTexture() {
    const graphics = this.add.graphics()

    // Base grass color
    graphics.fillStyle(0x4CAF50, 1)
    graphics.fillRect(0, 0, 64, 64)

    // Add some darker grass patches for texture
    graphics.fillStyle(0x388E3C, 1)
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 64
      const y = Math.random() * 64
      const size = Math.random() * 8 + 4
      graphics.fillRect(x, y, size, size)
    }

    // Generate texture from graphics
    graphics.generateTexture('grass-tile', 64, 64)
    graphics.destroy()
  }

  create() {
    // Transition to game scene
    this.scene.start('GameScene')
  }
}
```

### 4. Create Game Scene (`src/scenes/GameScene.ts`)
```typescript
import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // Create grass field using tileable grass texture
    this.createGrassField()

    // Set up camera bounds
    this.cameras.main.setBounds(0, 0, 800, 600)

    // Set up input (will be used in later tickets)
    this.cursors = this.input.keyboard!.createCursorKeys()

    // Debug text
    this.add.text(10, 10, 'Canvas Course World - MVP', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    })
  }

  private createGrassField() {
    const tileSize = 64
    const cols = Math.ceil(800 / tileSize)
    const rows = Math.ceil(600 / tileSize)

    // Fill the entire scene with grass tiles
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.add.image(x * tileSize, y * tileSize, 'grass-tile')
          .setOrigin(0, 0)
      }
    }
  }

  update(time: number, delta: number) {
    // Game loop (will be used in later tickets)
  }
}
```

### 5. Test the Setup
Run `npm run dev` and verify:
- Game window appears (800x600)
- Grass field renders
- "Canvas Course World - MVP" text appears in top-left
- No console errors

## Acceptance Criteria
- [ ] Phaser game instance initializes successfully
- [ ] Game window is 800x600 and centered
- [ ] Grass field texture is generated and tiles correctly
- [ ] PreloadScene transitions to GameScene
- [ ] Debug text displays in top-left corner
- [ ] No console errors
- [ ] Game runs at smooth 60 FPS

## Dependencies
- Ticket 01 (Project Setup) must be complete

## Estimated Time
45-60 minutes

## Notes
- We're creating a simple procedural grass texture for now. In the future, this can be replaced with actual tilemap assets.
- Camera bounds match game dimensions for MVP; will expand for full game.
- Physics system is set up for arcade physics (simple and performant for top-down games).
