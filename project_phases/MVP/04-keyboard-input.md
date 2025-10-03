# Ticket 04: Implement Keyboard Input Handling

## Objective
Set up keyboard input handling for arrow keys and WASD, creating the foundation for 8-directional movement.

## Tasks

### 1. Create Input Manager (`src/utils/InputManager.ts`)
```typescript
import Phaser from 'phaser'

export interface InputState {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

export default class InputManager {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd: {
    W: Phaser.Input.Keyboard.Key
    A: Phaser.Input.Keyboard.Key
    S: Phaser.Input.Keyboard.Key
    D: Phaser.Input.Keyboard.Key
  }

  constructor(scene: Phaser.Scene) {
    // Create cursor keys (arrow keys)
    this.cursors = scene.input.keyboard!.createCursorKeys()

    // Create WASD keys
    this.wasd = scene.input.keyboard!.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D
    }) as any
  }

  public getInputState(): InputState {
    return {
      up: this.cursors.up.isDown || this.wasd.W.isDown,
      down: this.cursors.down.isDown || this.wasd.S.isDown,
      left: this.cursors.left.isDown || this.wasd.A.isDown,
      right: this.cursors.right.isDown || this.wasd.D.isDown
    }
  }

  public isAnyKeyPressed(): boolean {
    const state = this.getInputState()
    return state.up || state.down || state.left || state.right
  }

  public getDirectionVector(): Phaser.Math.Vector2 {
    const state = this.getInputState()
    const vector = new Phaser.Math.Vector2(0, 0)

    if (state.left) vector.x = -1
    if (state.right) vector.x = 1
    if (state.up) vector.y = -1
    if (state.down) vector.y = 1

    // Normalize to prevent faster diagonal movement
    return vector.normalize()
  }

  public getDirection8Way(): string {
    const state = this.getInputState()

    // 8-directional movement
    if (state.up && state.right) return 'north-east'
    if (state.up && state.left) return 'north-west'
    if (state.down && state.right) return 'south-east'
    if (state.down && state.left) return 'south-west'
    if (state.up) return 'north'
    if (state.down) return 'south'
    if (state.left) return 'west'
    if (state.right) return 'east'

    return ''
  }
}
```

### 2. Update Player Class to Use Input
Update `src/sprites/Player.ts`:

```typescript
import Phaser from 'phaser'

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
  private speed: number = 100
  private isMoving: boolean = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-south')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    body.setSize(32, 32)
    body.setOffset(16, 24)

    this.setScale(1)
    this.setDepth(10)
  }

  public move(directionVector: Phaser.Math.Vector2, direction8Way: string) {
    if (directionVector.length() === 0) {
      this.stop()
      return
    }

    this.isMoving = true

    // Update direction
    if (direction8Way) {
      this.setDirection(direction8Way as Direction)
    }

    // Set velocity based on direction vector
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocity(
      directionVector.x * this.speed,
      directionVector.y * this.speed
    )
  }

  public stop() {
    if (!this.isMoving) return

    this.isMoving = false
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0, 0)
    this.updateSprite()
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
      this.updateSprite()
    }
  }

  private updateSprite() {
    this.setTexture(`player-${this.currentDirection}`)
  }

  public getIsMoving(): boolean {
    return this.isMoving
  }
}
```

### 3. Update GameScene to Handle Input
Update `src/scenes/GameScene.ts`:

```typescript
import Phaser from 'phaser'
import Player from '../sprites/Player'
import InputManager from '../utils/InputManager'

export default class GameScene extends Phaser.Scene {
  private player!: Player
  private inputManager!: InputManager

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.createGrassField()

    // Create player
    this.player = new Player(this, 400, 300)

    // Set up input
    this.inputManager = new InputManager(this)

    // Camera setup
    this.cameras.main.setBounds(0, 0, 800, 600)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    // UI text
    this.add.text(10, 10, 'Canvas Course World - MVP\nUse Arrow Keys or WASD to move', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0)
  }

  private createGrassField() {
    const tileSize = 64
    const cols = Math.ceil(800 / tileSize)
    const rows = Math.ceil(600 / tileSize)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.add.image(x * tileSize, y * tileSize, 'grass-tile')
          .setOrigin(0, 0)
      }
    }
  }

  update(time: number, delta: number) {
    // Get input state
    const directionVector = this.inputManager.getDirectionVector()
    const direction8Way = this.inputManager.getDirection8Way()

    // Update player movement
    this.player.move(directionVector, direction8Way)
  }
}
```

## Acceptance Criteria
- [ ] Arrow keys control player movement
- [ ] WASD keys control player movement
- [ ] Both arrow keys and WASD work simultaneously
- [ ] Diagonal movement works (e.g., up+right moves north-east)
- [ ] Diagonal movement speed equals cardinal direction speed (normalized)
- [ ] Player sprite rotation changes to match movement direction
- [ ] Player stops moving when no keys are pressed
- [ ] Player stays within screen bounds (collideWorldBounds)
- [ ] Instructions text displays on screen

## Dependencies
- Ticket 03 (Player Sprite) must be complete

## Estimated Time
1-1.5 hours

## Testing Checklist
1. Test all 8 directions:
   - North (Up/W)
   - North-East (Up+Right / W+D)
   - East (Right/D)
   - South-East (Down+Right / S+D)
   - South (Down/S)
   - South-West (Down+Left / S+A)
   - West (Left/A)
   - North-West (Up+Left / W+A)

2. Verify sprite rotation:
   - Player sprite should face the direction of movement
   - Sprite should update immediately when direction changes

3. Test edge cases:
   - Multiple keys pressed simultaneously
   - Switching between arrow keys and WASD mid-movement
   - Pressing opposite keys (Up+Down, Left+Right) - should cancel out

4. Performance:
   - Movement should be smooth at 60 FPS
   - No input lag

## Notes
- Vector normalization prevents diagonal movement from being 1.414x faster than cardinal movement
- InputManager abstracts keyboard handling, making it easy to add gamepad support later
- The 8-way direction system matches our 8 rotation sprites perfectly
