# Ticket 08: Polish and Testing

## Objective
Final polish pass to ensure smooth gameplay, add quality-of-life features, and comprehensive testing of the MVP.

## Tasks

### 1. Add FPS Counter (Development Mode)
Update `src/scenes/GameScene.ts`:

```typescript
private createUI() {
  // Existing info text
  const infoText = this.add.text(10, 10, '', {
    fontSize: '14px',
    color: '#ffffff',
    backgroundColor: '#000000aa',
    padding: { x: 8, y: 4 }
  }).setScrollFactor(0).setDepth(100)

  // FPS counter (top-right corner)
  const fpsText = this.add.text(
    GAME_CONFIG.world.width - 10,
    10,
    '',
    {
      fontSize: '12px',
      color: '#00ff00',
      backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }
  ).setScrollFactor(0).setDepth(100).setOrigin(1, 0)

  this.events.on('postupdate', () => {
    const velocity = this.player.getVelocity()
    const speed = velocity.length().toFixed(0)
    const direction = this.player.getCurrentDirection()
    const pos = this.player.getPosition()

    infoText.setText([
      'Canvas Course World - MVP',
      'Use Arrow Keys or WASD to move',
      '',
      `Position: (${Math.round(pos.x)}, ${Math.round(pos.y)})`,
      `Direction: ${direction}`,
      `Speed: ${speed} px/s`
    ])

    // Update FPS
    const fps = Math.round(this.game.loop.actualFps)
    fpsText.setText(`FPS: ${fps}`)

    // Color code based on performance
    if (fps >= 55) {
      fpsText.setColor('#00ff00') // Green - good
    } else if (fps >= 30) {
      fpsText.setColor('#ffff00') // Yellow - okay
    } else {
      fpsText.setColor('#ff0000') // Red - poor
    }
  })
}
```

### 2. Add Keyboard Shortcuts
Create `src/utils/DebugKeys.ts`:

```typescript
import Phaser from 'phaser'
import { GAME_CONFIG } from '../config/GameConfig'

export default class DebugKeys {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.setupKeys()
  }

  private setupKeys() {
    const keyboard = this.scene.input.keyboard!

    // F key - toggle fullscreen
    keyboard.on('keydown-F', () => {
      if (this.scene.scale.isFullscreen) {
        this.scene.scale.stopFullscreen()
      } else {
        this.scene.scale.startFullscreen()
      }
    })

    // R key - restart scene
    keyboard.on('keydown-R', () => {
      this.scene.scene.restart()
    })

    // I key - toggle info display
    keyboard.on('keydown-I', () => {
      // Will be implemented if info text variable is accessible
      console.log('Toggle info display')
    })

    // P key - pause/resume
    keyboard.on('keydown-P', () => {
      if (this.scene.scene.isPaused()) {
        this.scene.scene.resume()
      } else {
        this.scene.scene.pause()
      }
    })
  }
}
```

Update `src/scenes/GameScene.ts` to use debug keys:

```typescript
import DebugKeys from '../utils/DebugKeys'

// In create():
new DebugKeys(this)
```

### 3. Add Responsive Canvas Scaling
Update `src/game.ts`:

```typescript
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: DEBUG_MODE
    }
  },
  scene: [PreloadScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 400,
      height: 300
    },
    max: {
      width: 1600,
      height: 1200
    }
  },
  pixelArt: true,
  render: {
    antialias: false
  }
}
```

### 4. Add Loading Progress Bar
Update `src/scenes/PreloadScene.ts`:

```typescript
preload() {
  const centerX = this.cameras.main.centerX
  const centerY = this.cameras.main.centerY

  // Create loading bar background
  const progressBar = this.add.graphics()
  const progressBox = this.add.graphics()
  progressBox.fillStyle(0x222222, 0.8)
  progressBox.fillRect(centerX - 160, centerY - 30, 320, 50)

  // Loading text
  const loadingText = this.add.text(centerX, centerY - 50, 'Loading Canvas Course World...', {
    fontSize: '20px',
    color: '#ffffff'
  })
  loadingText.setOrigin(0.5)

  // Percentage text
  const percentText = this.add.text(centerX, centerY, '0%', {
    fontSize: '18px',
    color: '#ffffff'
  })
  percentText.setOrigin(0.5)

  // Asset text
  const assetText = this.add.text(centerX, centerY + 50, '', {
    fontSize: '14px',
    color: '#ffffff'
  })
  assetText.setOrigin(0.5)

  // Update progress bar
  this.load.on('progress', (value: number) => {
    progressBar.clear()
    progressBar.fillStyle(0x4CAF50, 1)
    progressBar.fillRect(centerX - 150, centerY - 20, 300 * value, 30)
    percentText.setText(`${Math.round(value * 100)}%`)
  })

  // Update asset being loaded
  this.load.on('fileprogress', (file: any) => {
    assetText.setText(`Loading: ${file.key}`)
  })

  // Complete
  this.load.on('complete', () => {
    progressBar.destroy()
    progressBox.destroy()
    loadingText.destroy()
    percentText.destroy()
    assetText.destroy()
  })

  this.createGrassTexture()
  this.loadPlayerAssets()
}
```

### 5. Create README for MVP
Update main README or create `project_phases/MVP/README.md`:

```markdown
# MVP - Walking in a Grassy Field

## Running the MVP

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open browser to http://localhost:3000

## Controls

- **Arrow Keys** or **WASD**: Move character
- **F**: Toggle fullscreen
- **R**: Restart scene
- **P**: Pause/resume

## Features Implemented

✅ 8-directional character movement
✅ Smooth keyboard controls (arrow keys + WASD)
✅ Walk animations for 4 cardinal directions
✅ Static rotation sprites for 8 directions
✅ Collision boundaries with visual borders
✅ Responsive canvas scaling
✅ Performance monitoring (FPS counter)
✅ Loading screen with progress bar

## Known Issues

None - MVP is complete!

## Next Steps

See parent README for full game vision including:
- Canvas LMS integration
- Building interactions
- Multiple buildings (Assignment Hall, Discussion Tavern, etc.)
- Multiplayer avatars
- UI overlays and menus
\`\`\`

### 6. Comprehensive Testing Script
Create `project_phases/MVP/TESTING.md`:

```markdown
# MVP Testing Checklist

## Setup Testing
- [ ] npm install completes without errors
- [ ] npm run dev starts server
- [ ] Browser opens to http://localhost:3000
- [ ] Loading screen displays with progress bar
- [ ] Game loads without console errors

## Visual Testing
- [ ] Grass field renders completely
- [ ] Brown borders visible around play area
- [ ] Corner posts render at all 4 corners
- [ ] Player sprite renders in center
- [ ] Debug UI displays in top-left
- [ ] FPS counter displays in top-right (green)

## Movement Testing

### Cardinal Directions
- [ ] North (Up/W) - character faces north, plays north walk animation
- [ ] South (Down/S) - character faces south, plays south walk animation
- [ ] East (Right/D) - character faces east, plays east walk animation
- [ ] West (Left/A) - character faces west, plays west walk animation

### Diagonal Directions
- [ ] North-East (Up+Right/W+D) - faces NE, plays north walk animation
- [ ] South-East (Down+Right/S+D) - faces SE, plays south walk animation
- [ ] South-West (Down+Left/S+A) - faces SW, plays south walk animation
- [ ] North-West (Up+Left/W+A) - faces NW, plays north walk animation

### Animation Testing
- [ ] Walk animations play smoothly
- [ ] Animation loops seamlessly
- [ ] Animation stops when keys released
- [ ] Static rotation sprite shows when stopped
- [ ] Correct static sprite for each of 8 directions

## Boundary Testing
- [ ] Cannot move past top boundary
- [ ] Cannot move past bottom boundary
- [ ] Cannot move past left boundary
- [ ] Cannot move past right boundary
- [ ] Can slide along boundaries
- [ ] Boundary effect shows on collision
- [ ] Effect doesn't spam (cooldown works)

## Performance Testing
- [ ] FPS stays green (55+) during normal movement
- [ ] No stuttering or lag
- [ ] Smooth movement in all directions
- [ ] No memory leaks (check after 5 minutes)

## Input Testing
- [ ] Arrow keys work
- [ ] WASD keys work
- [ ] Can switch between arrow keys and WASD mid-movement
- [ ] Multiple keys pressed simultaneously works
- [ ] F key toggles fullscreen
- [ ] R key restarts scene
- [ ] P key pauses/resumes

## Responsive Testing
- [ ] Resize browser window - game scales properly
- [ ] Game stays centered
- [ ] Aspect ratio maintained
- [ ] Works at minimum size (400x300)
- [ ] Works at maximum size (1600x1200)

## Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

## Final Verification
- [ ] No console errors
- [ ] No console warnings
- [ ] All assets load (no 404s)
- [ ] Game runs for 5+ minutes without issues
\`\`\`

## Acceptance Criteria
- [ ] All previous tickets' features work correctly
- [ ] FPS counter displays and stays green
- [ ] Keyboard shortcuts work (F, R, P)
- [ ] Loading screen with progress bar
- [ ] Responsive scaling works correctly
- [ ] All tests in TESTING.md pass
- [ ] README.md updated with MVP instructions
- [ ] No console errors or warnings

## Dependencies
- Ticket 07 (Collision Boundaries) must be complete

## Estimated Time
2-3 hours (including comprehensive testing)

## Deliverables
- [ ] Working MVP demo
- [ ] README with instructions
- [ ] TESTING.md checklist
- [ ] All tests passing
- [ ] Performance verified (60 FPS)

## Notes
- This ticket focuses on polish and verification
- Comprehensive testing ensures quality before moving to next phase
- Debug keys improve development experience
- Loading screen provides professional feel
