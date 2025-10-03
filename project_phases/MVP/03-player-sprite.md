# Ticket 03: Load and Configure Player Sprite

## Objective
Load the character sprite assets and create a Player class that can be instantiated in the game scene.

## Tasks

### 1. Create Player Class (`src/sprites/Player.ts`)
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
  private speed: number = 100 // pixels per second

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-south')

    // Add to scene
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Configure physics body
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    body.setSize(32, 32) // Collision box smaller than sprite
    body.setOffset(16, 24) // Center the collision box

    // Set initial scale and properties
    this.setScale(1)
    this.setDepth(10) // Ensure player renders above ground
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
    // Update the texture based on direction (will be used when walking stops)
    this.setTexture(`player-${this.currentDirection}`)
  }

  public stop() {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0, 0)
    this.updateSprite()
  }
}
```

### 2. Update PreloadScene to Load Character Assets
Update `src/scenes/PreloadScene.ts`:

```typescript
preload() {
  // ... existing loading text code ...

  this.createGrassTexture()
  this.loadPlayerAssets()
}

private loadPlayerAssets() {
  const basePath = 'assets/characters/player'

  // Load rotation sprites (static poses for each direction)
  this.load.image('player-north', `${basePath}/rotations/north.png`)
  this.load.image('player-north-east', `${basePath}/rotations/north-east.png`)
  this.load.image('player-east', `${basePath}/rotations/east.png`)
  this.load.image('player-south-east', `${basePath}/rotations/south-east.png`)
  this.load.image('player-south', `${basePath}/rotations/south.png`)
  this.load.image('player-south-west', `${basePath}/rotations/south-west.png`)
  this.load.image('player-west', `${basePath}/rotations/west.png`)
  this.load.image('player-north-west', `${basePath}/rotations/north-west.png`)

  // Walk animations will be loaded in Ticket 06
}
```

### 3. Add Player to GameScene
Update `src/scenes/GameScene.ts`:

```typescript
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class GameScene extends Phaser.Scene {
  private player!: Player
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.createGrassField()

    // Create player in center of screen
    this.player = new Player(this, 400, 300)

    // Set up camera to follow player (will be useful when world expands)
    this.cameras.main.setBounds(0, 0, 800, 600)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    this.cursors = this.input.keyboard!.createCursorKeys()

    this.add.text(10, 10, 'Canvas Course World - MVP', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0) // Keep text fixed to camera
  }

  // ... existing createGrassField() ...

  update(time: number, delta: number) {
    // Movement will be implemented in next tickets
  }
}
```

### 4. Create Types File (Optional but Recommended)
Create `src/types/index.ts`:

```typescript
export interface PlayerConfig {
  speed: number
  spriteName: string
}

export interface GameData {
  // Will be expanded as needed
}
```

## Acceptance Criteria
- [ ] All 8 directional rotation sprites load without errors
- [ ] Player sprite appears in center of screen facing south
- [ ] Player sprite renders at correct scale (64x64 pixels)
- [ ] Player has physics body with collision bounds
- [ ] Camera follows player (even though player isn't moving yet)
- [ ] No console errors or warnings
- [ ] Player renders above grass field (correct depth)

## Dependencies
- Ticket 02 (Grass Field Scene) must be complete

## Estimated Time
1-1.5 hours

## Testing Checklist
1. Verify player sprite loads and displays
2. Check browser dev tools for any 404 errors on sprite assets
3. Confirm player is centered at (400, 300)
4. Verify sprite size is appropriate (not too large or small)
5. Check physics debug mode (`physics.arcade.debug: true`) to verify collision body

## Notes
- The collision box (32x32) is intentionally smaller than the sprite (64x64) to allow for visual overlap with buildings/objects in the future
- Using `setScrollFactor(0)` on debug text keeps it fixed to camera
- Player depth is set to 10 to ensure rendering above background elements
