# Ticket 02: Scene Transition System

## Objective
Implement smooth transitions between the outdoor GameScene and indoor building scenes, starting with the Library interior.

## Tasks

### 1. Create LibraryInteriorScene

Create `src/scenes/LibraryInteriorScene.ts`:

```typescript
import Phaser from 'phaser'
import Player from '../sprites/Player'
import InputManager from '../utils/InputManager'

export interface LibrarySceneData {
  playerData: {
    previousX: number
    previousY: number
  }
  moduleData?: any[] // Will be populated from Canvas API later
}

export default class LibraryInteriorScene extends Phaser.Scene {
  private player!: Player
  private inputManager!: InputManager
  private exitKey!: Phaser.Input.Keyboard.Key
  private previousPlayerPosition!: { x: number, y: number }

  constructor() {
    super({ key: 'LibraryInteriorScene' })
  }

  init(data: LibrarySceneData) {
    // Store where the player was in the outdoor scene
    this.previousPlayerPosition = {
      x: data.playerData.previousX,
      y: data.playerData.previousY
    }
  }

  create() {
    // Temporary: Just create a simple interior space
    this.createTemporaryInterior()

    // Create player in library
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2
    this.player = new Player(this, centerX, centerY + 100)

    // Input setup
    this.inputManager = new InputManager(this)

    // Exit key (E)
    this.exitKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)

    // Camera setup
    this.cameras.main.setBounds(0, 0, 800, 600)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    // Exit prompt
    this.createExitPrompt()

    // UI
    this.createUI()
  }

  private createTemporaryInterior() {
    // Simple interior background
    const graphics = this.add.graphics()

    // Wood floor
    graphics.fillStyle(0x8B4513, 1)
    graphics.fillRect(0, 0, 800, 600)

    // Add some texture to floor
    graphics.fillStyle(0x654321, 0.3)
    for (let y = 0; y < 600; y += 64) {
      for (let x = 0; x < 800; x += 64) {
        if ((x + y) % 128 === 0) {
          graphics.fillRect(x, y, 64, 64)
        }
      }
    }

    // Walls (darker)
    graphics.fillStyle(0x4a4a4a, 1)
    graphics.fillRect(0, 0, 800, 50) // Top wall
    graphics.fillRect(0, 0, 50, 600) // Left wall
    graphics.fillRect(750, 0, 50, 600) // Right wall

    // Exit door (at bottom center)
    graphics.fillStyle(0x8B4513, 1)
    graphics.fillRect(350, 580, 100, 20)

    // Door frame
    graphics.lineStyle(3, 0x000000, 1)
    graphics.strokeRect(350, 580, 100, 20)

    // "EXIT" sign
    this.add.text(400, 550, 'EXIT', {
      fontSize: '16px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5)
  }

  private createExitPrompt() {
    const exitPrompt = this.add.text(
      400,
      520,
      'Press [E] to exit library',
      {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#000000dd',
        padding: { x: 8, y: 4 }
      }
    )
    exitPrompt.setOrigin(0.5)
    exitPrompt.setScrollFactor(0)
    exitPrompt.setDepth(100)
    exitPrompt.setVisible(false)

    // Show prompt when near exit
    this.events.on('postupdate', () => {
      const playerY = this.player.y
      if (playerY > 500) {
        exitPrompt.setVisible(true)

        // Check for E key press
        if (Phaser.Input.Keyboard.JustDown(this.exitKey)) {
          this.exitLibrary()
        }
      } else {
        exitPrompt.setVisible(false)
      }
    })
  }

  private createUI() {
    const infoText = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000dd',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(100)

    this.events.on('postupdate', () => {
      const pos = this.player.getPosition()
      const velocity = this.player.getVelocity()
      const speed = velocity.length().toFixed(0)

      infoText.setText([
        'University Library - Lobby',
        'Use Arrow Keys or WASD to move',
        `Position: (${Math.round(pos.x)}, ${Math.round(pos.y)})`,
        `Speed: ${speed} px/s`,
        'Walk to EXIT to leave'
      ])
    })
  }

  update(time: number, delta: number) {
    const directionVector = this.inputManager.getDirectionVector()
    const direction8Way = this.inputManager.getDirection8Way()

    this.player.move(directionVector, direction8Way)
  }

  private exitLibrary() {
    // Transition back to outdoor scene
    this.scene.start('GameScene', {
      returnFromBuilding: true,
      playerPosition: this.previousPlayerPosition
    })
  }
}
```

### 2. Register LibraryInteriorScene in Game Config

Update `src/game.ts`:

```typescript
import LibraryInteriorScene from './scenes/LibraryInteriorScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  // ... existing config ...
  scene: [
    PreloadScene,
    GameScene,
    LibraryInteriorScene // Add new scene
  ]
}
```

### 3. Update GameScene to Handle Transitions

Update `src/scenes/GameScene.ts`:

```typescript
export default class GameScene extends Phaser.Scene {
  // ... existing code ...

  init(data?: any) {
    // Handle returning from building
    if (data?.returnFromBuilding && data?.playerPosition) {
      // Will reposition player after create()
      this.registry.set('returnPosition', data.playerPosition)
    }
  }

  create() {
    // ... existing scene setup ...

    // Check if returning from building
    const returnPosition = this.registry.get('returnPosition')
    if (returnPosition) {
      this.player.setPosition(returnPosition.x, returnPosition.y)
      this.registry.remove('returnPosition')
    }
  }

  private handleEnterBuilding(data: { buildingType: string, building: any }) {
    const { buildingType } = data

    if (buildingType === 'library') {
      this.enterLibrary()
    } else {
      console.log(`Building type ${buildingType} not yet implemented`)
    }
  }

  private enterLibrary() {
    // Get player's current position
    const playerPos = this.player.getPosition()

    // Transition to library interior
    this.scene.start('LibraryInteriorScene', {
      playerData: {
        previousX: playerPos.x,
        previousY: playerPos.y
      }
    })
  }
}
```

### 4. Add Transition Effects (Optional Enhancement)

Create `src/effects/SceneTransition.ts`:

```typescript
export default class SceneTransition {
  static fadeOut(
    scene: Phaser.Scene,
    duration: number = 500,
    callback: () => void
  ) {
    scene.cameras.main.fadeOut(duration, 0, 0, 0)
    scene.cameras.main.once('camerafadeoutcomplete', callback)
  }

  static fadeIn(scene: Phaser.Scene, duration: number = 500) {
    scene.cameras.main.fadeIn(duration, 0, 0, 0)
  }
}
```

Update scene transitions to use fade effects:

```typescript
// In GameScene.enterLibrary()
private enterLibrary() {
  const playerPos = this.player.getPosition()

  SceneTransition.fadeOut(this, 300, () => {
    this.scene.start('LibraryInteriorScene', {
      playerData: {
        previousX: playerPos.x,
        previousY: playerPos.y
      }
    })
  })
}

// In LibraryInteriorScene.create()
create() {
  // ... existing setup ...

  // Fade in when entering
  SceneTransition.fadeIn(this, 300)
}

// In LibraryInteriorScene.exitLibrary()
private exitLibrary() {
  SceneTransition.fadeOut(this, 300, () => {
    this.scene.start('GameScene', {
      returnFromBuilding: true,
      playerPosition: this.previousPlayerPosition
    })
  })
}
```

## Testing Checklist

### Scene Transition
- [ ] Walk to library and press E - transitions to interior scene
- [ ] Library interior loads with simple floor and walls
- [ ] Player spawns in center of library
- [ ] Walk to bottom exit area - "Press E to exit" prompt appears
- [ ] Press E at exit - returns to outdoor scene
- [ ] Player returns to same position they entered from

### Visual Quality
- [ ] Fade out effect when entering (if implemented)
- [ ] Fade in effect when scene loads (if implemented)
- [ ] No jarring instant transitions
- [ ] EXIT sign is visible and clear

### Controls
- [ ] Movement works identically in interior scene
- [ ] E key only triggers exit when near exit door
- [ ] Camera follows player in interior

### UI
- [ ] Interior scene shows "University Library - Lobby" in UI
- [ ] Position and speed still display correctly
- [ ] Exit prompt only shows when near exit

## Acceptance Criteria
- [ ] Player can enter library from outdoor world
- [ ] Interior scene displays with basic environment
- [ ] Player can exit library and return to outdoor world
- [ ] Player position is preserved when exiting
- [ ] Smooth transitions between scenes
- [ ] Exit is clearly marked and interactive

## Dependencies
- Ticket 01 complete (interaction system)
- PreloadScene loads all necessary assets

## Estimated Time
1-1.5 hours

## Notes
- Currently library interior is temporary/simple - will be enhanced in future tickets
- Scene transition preserves player's outdoor position for immersion
- E key serves dual purpose: enter building AND exit building
- Interior scene is self-contained and doesn't need large world bounds
- Future: add door opening animation, loading screen for large buildings
