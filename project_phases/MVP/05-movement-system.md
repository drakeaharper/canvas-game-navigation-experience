# Ticket 05: Implement 8-Directional Movement System

## Objective
Refine the movement system to ensure smooth, responsive 8-directional movement with proper physics integration.

## Tasks

### 1. Add Movement Configuration
Create `src/config/GameConfig.ts`:

```typescript
export const GAME_CONFIG = {
  world: {
    width: 800,
    height: 600
  },
  player: {
    speed: 120, // pixels per second
    acceleration: 600, // faster acceleration for snappy controls
    drag: 400 // drag when stopping
  },
  camera: {
    lerp: 0.1 // smooth camera follow
  }
}
```

### 2. Enhance Player Movement Physics
Update `src/sprites/Player.ts` with better physics:

```typescript
import Phaser from 'phaser'
import { GAME_CONFIG } from '../config/GameConfig'

export enum Direction {
  NORTH = 'north',
  NORTH_EAST = 'north-east',
  EAST = 'east',
  SOUTH_EAST = 'south-east',
  SOUTH = 'south',
  SOUTH_WEST = 'south-west',
  WEST = 'west',
  NORTH_WEST = 'north-west'
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private currentDirection: Direction = Direction.SOUTH
  private speed: number = GAME_CONFIG.player.speed
  private isMoving: boolean = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-south')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body

    // Physics configuration
    body.setCollideWorldBounds(true)
    body.setSize(32, 32)
    body.setOffset(16, 24)
    body.setMaxVelocity(this.speed, this.speed)
    body.setDrag(GAME_CONFIG.player.drag, GAME_CONFIG.player.drag)

    this.setScale(1)
    this.setDepth(10)
  }

  public move(directionVector: Phaser.Math.Vector2, direction8Way: string) {
    const body = this.body as Phaser.Physics.Arcade.Body

    if (directionVector.length() === 0) {
      this.stop()
      return
    }

    this.isMoving = true

    // Update facing direction
    if (direction8Way) {
      this.setDirection(direction8Way as Direction)
    }

    // Apply acceleration-based movement for smoother feel
    const accelX = directionVector.x * GAME_CONFIG.player.acceleration
    const accelY = directionVector.y * GAME_CONFIG.player.acceleration

    body.setAcceleration(accelX, accelY)
  }

  public stop() {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAcceleration(0, 0)

    // Only update sprite if we were moving
    if (this.isMoving) {
      this.isMoving = false
      this.updateSprite()
    }
  }

  public getSpeed(): number {
    return this.speed
  }

  public getCurrentDirection(): Direction {
    return this.currentDirection
  }

  public setDirection(direction: Direction) {
    if (this.currentDirection !== direction) {
      this.currentDirection = direction

      // Only update sprite texture while moving
      if (this.isMoving) {
        this.updateSprite()
      }
    }
  }

  private updateSprite() {
    this.setTexture(`player-${this.currentDirection}`)
  }

  public getIsMoving(): boolean {
    return this.isMoving
  }

  public getVelocity(): Phaser.Math.Vector2 {
    const body = this.body as Phaser.Physics.Arcade.Body
    return new Phaser.Math.Vector2(body.velocity.x, body.velocity.y)
  }
}
```

### 3. Update GameScene with Configuration
Update `src/scenes/GameScene.ts`:

```typescript
import Phaser from 'phaser'
import Player from '../sprites/Player'
import InputManager from '../utils/InputManager'
import { GAME_CONFIG } from '../config/GameConfig'

export default class GameScene extends Phaser.Scene {
  private player!: Player
  private inputManager!: InputManager

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(
      0,
      0,
      GAME_CONFIG.world.width,
      GAME_CONFIG.world.height
    )

    this.createGrassField()

    // Create player in center
    const centerX = GAME_CONFIG.world.width / 2
    const centerY = GAME_CONFIG.world.height / 2
    this.player = new Player(this, centerX, centerY)

    // Input setup
    this.inputManager = new InputManager(this)

    // Camera setup
    this.cameras.main.setBounds(
      0,
      0,
      GAME_CONFIG.world.width,
      GAME_CONFIG.world.height
    )
    this.cameras.main.startFollow(
      this.player,
      true,
      GAME_CONFIG.camera.lerp,
      GAME_CONFIG.camera.lerp
    )

    // UI
    this.createUI()
  }

  private createGrassField() {
    const tileSize = 64
    const cols = Math.ceil(GAME_CONFIG.world.width / tileSize)
    const rows = Math.ceil(GAME_CONFIG.world.height / tileSize)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.add.image(x * tileSize, y * tileSize, 'grass-tile')
          .setOrigin(0, 0)
      }
    }
  }

  private createUI() {
    const text = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0)

    // Update UI every frame
    this.events.on('postupdate', () => {
      const velocity = this.player.getVelocity()
      const speed = velocity.length().toFixed(0)
      const direction = this.player.getCurrentDirection()

      text.setText([
        'Canvas Course World - MVP',
        'Use Arrow Keys or WASD to move',
        `Direction: ${direction}`,
        `Speed: ${speed} px/s`
      ])
    })
  }

  update(time: number, delta: number) {
    const directionVector = this.inputManager.getDirectionVector()
    const direction8Way = this.inputManager.getDirection8Way()

    this.player.move(directionVector, direction8Way)
  }
}
```

### 4. Add Debug Mode Toggle
Update `src/game.ts` to make debug mode toggleable:

```typescript
import Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene'
import GameScene from './scenes/GameScene'

const DEBUG_MODE = false // Set to true to see collision boxes

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
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true,
  render: {
    antialias: false
  }
}

export default gameConfig
```

## Acceptance Criteria
- [ ] Player moves smoothly in all 8 directions
- [ ] Movement feels responsive with proper acceleration/deceleration
- [ ] Diagonal movement speed matches cardinal direction speed
- [ ] Player stays within world bounds
- [ ] Sprite rotates correctly for all 8 directions
- [ ] Debug UI shows current direction and speed
- [ ] No jittery or stuttering movement
- [ ] 60 FPS maintained during movement

## Dependencies
- Ticket 04 (Keyboard Input) must be complete

## Estimated Time
1 hour

## Testing Checklist

### Movement Feel
- [ ] Movement should feel snappy and responsive
- [ ] Character should come to a smooth stop when keys released
- [ ] No ice-skating or sliding feel
- [ ] Direction changes should be instant

### Direction Testing
Test each direction and verify sprite matches:
- [ ] North - character faces up
- [ ] North-East - character faces up-right
- [ ] East - character faces right
- [ ] South-East - character faces down-right
- [ ] South - character faces down
- [ ] South-West - character faces down-left
- [ ] West - character faces left
- [ ] North-West - character faces up-left

### Edge Cases
- [ ] Run into each wall - character should stop at boundary
- [ ] Change direction rapidly - should remain smooth
- [ ] Hold all keys at once - should handle gracefully
- [ ] Test with different frame rates (throttle CPU in dev tools)

### Performance
- [ ] Check FPS counter (Shift+F3 in Chrome dev tools)
- [ ] Should maintain 60 FPS consistently
- [ ] No memory leaks (check performance tab after 5 minutes)

## Notes
- Using acceleration + drag creates more natural-feeling movement than direct velocity setting
- MaxVelocity prevents acceleration from exceeding intended speed
- Debug mode shows collision boundaries for development
- UI updates show real-time movement data for debugging
