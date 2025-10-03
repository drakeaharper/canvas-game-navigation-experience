# Ticket 06: Add Walk Animations

## Objective
Load the walking animation spritesheets and play appropriate animations based on movement direction.

## Tasks

### 1. Update PreloadScene to Load Walk Animations
Update `src/scenes/PreloadScene.ts`:

```typescript
private loadPlayerAssets() {
  const basePath = 'assets/characters/player'

  // Load rotation sprites (static poses)
  this.load.image('player-north', `${basePath}/rotations/north.png`)
  this.load.image('player-north-east', `${basePath}/rotations/north-east.png`)
  this.load.image('player-east', `${basePath}/rotations/east.png`)
  this.load.image('player-south-east', `${basePath}/rotations/south-east.png`)
  this.load.image('player-south', `${basePath}/rotations/south.png`)
  this.load.image('player-south-west', `${basePath}/rotations/south-west.png`)
  this.load.image('player-west', `${basePath}/rotations/west.png`)
  this.load.image('player-north-west', `${basePath}/rotations/north-west.png`)

  // Load walk animation frames
  // Each direction has 6 frames (frame_000 through frame_005)
  const walkDirections = ['north', 'south', 'east', 'west']

  walkDirections.forEach(direction => {
    for (let i = 0; i < 6; i++) {
      const frameNum = i.toString().padStart(3, '0')
      const key = `player-walk-${direction}-${i}`
      const path = `${basePath}/animations/walk/${direction}/frame_${frameNum}.png`
      this.load.image(key, path)
    }
  })
}
```

### 2. Create Animation Manager
Create `src/utils/AnimationManager.ts`:

```typescript
import Phaser from 'phaser'

export default class AnimationManager {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public createPlayerAnimations() {
    const directions = ['north', 'south', 'east', 'west']

    directions.forEach(direction => {
      // Create walk animation for each cardinal direction
      const frames: Phaser.Types.Animations.AnimationFrame[] = []

      for (let i = 0; i < 6; i++) {
        frames.push({
          key: `player-walk-${direction}-${i}`,
          frame: null
        })
      }

      this.scene.anims.create({
        key: `walk-${direction}`,
        frames: frames,
        frameRate: 10, // 10 frames per second for smooth walking
        repeat: -1 // Loop indefinitely
      })
    })
  }
}
```

### 3. Update PreloadScene to Create Animations
Update `src/scenes/PreloadScene.ts`:

```typescript
import Phaser from 'phaser'
import AnimationManager from '../utils/AnimationManager'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    const centerX = this.cameras.main.centerX
    const centerY = this.cameras.main.centerY

    const loadingText = this.add.text(centerX, centerY, 'Loading...', {
      fontSize: '24px',
      color: '#ffffff'
    })
    loadingText.setOrigin(0.5)

    this.createGrassTexture()
    this.loadPlayerAssets()
  }

  // ... existing loadPlayerAssets and createGrassTexture ...

  create() {
    // Create animations before transitioning to game scene
    const animManager = new AnimationManager(this)
    animManager.createPlayerAnimations()

    this.scene.start('GameScene')
  }
}
```

### 4. Update Player Class to Use Animations
Update `src/sprites/Player.ts`:

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

    const wasMoving = this.isMoving
    this.isMoving = true

    // Update facing direction
    if (direction8Way) {
      this.setDirection(direction8Way as Direction)
    }

    // Start walking animation if just started moving
    if (!wasMoving) {
      this.playWalkAnimation()
    }

    // Apply acceleration
    const accelX = directionVector.x * GAME_CONFIG.player.acceleration
    const accelY = directionVector.y * GAME_CONFIG.player.acceleration
    body.setAcceleration(accelX, accelY)
  }

  public stop() {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAcceleration(0, 0)

    if (this.isMoving) {
      this.isMoving = false
      this.stopWalkAnimation()
    }
  }

  private playWalkAnimation() {
    const animKey = this.getAnimationKey()

    if (animKey && !this.anims.isPlaying) {
      this.play(animKey)
    }
  }

  private stopWalkAnimation() {
    this.anims.stop()
    this.updateStaticSprite()
  }

  private getAnimationKey(): string | null {
    // Map 8 directions to 4 cardinal animation directions
    switch (this.currentDirection) {
      case Direction.NORTH:
      case Direction.NORTH_EAST:
      case Direction.NORTH_WEST:
        return 'walk-north'

      case Direction.SOUTH:
      case Direction.SOUTH_EAST:
      case Direction.SOUTH_WEST:
        return 'walk-south'

      case Direction.EAST:
        return 'walk-east'

      case Direction.WEST:
        return 'walk-west'

      default:
        return null
    }
  }

  public setDirection(direction: Direction) {
    if (this.currentDirection !== direction) {
      const oldDirection = this.currentDirection
      this.currentDirection = direction

      // If moving, switch animation if the cardinal direction changed
      if (this.isMoving) {
        const oldAnimKey = this.getAnimationKeyForDirection(oldDirection)
        const newAnimKey = this.getAnimationKey()

        if (oldAnimKey !== newAnimKey && newAnimKey) {
          this.play(newAnimKey)
        }
      } else {
        this.updateStaticSprite()
      }
    }
  }

  private getAnimationKeyForDirection(direction: Direction): string | null {
    switch (direction) {
      case Direction.NORTH:
      case Direction.NORTH_EAST:
      case Direction.NORTH_WEST:
        return 'walk-north'

      case Direction.SOUTH:
      case Direction.SOUTH_EAST:
      case Direction.SOUTH_WEST:
        return 'walk-south'

      case Direction.EAST:
        return 'walk-east'

      case Direction.WEST:
        return 'walk-west'

      default:
        return null
    }
  }

  private updateStaticSprite() {
    // Use the 8-directional static rotation sprite when not moving
    this.setTexture(`player-${this.currentDirection}`)
  }

  public getCurrentDirection(): Direction {
    return this.currentDirection
  }

  public getIsMoving(): boolean {
    return this.isMoving
  }

  public getVelocity(): Phaser.Math.Vector2 {
    const body = this.body as Phaser.Physics.Arcade.Body
    return new Phaser.Math.Vector2(body.velocity.x, body.velocity.y)
  }

  public getSpeed(): number {
    return this.speed
  }
}
```

## Acceptance Criteria
- [ ] Walk animations load successfully for all 4 cardinal directions
- [ ] Walking north/northeast/northwest plays north walk animation
- [ ] Walking south/southeast/southwest plays south walk animation
- [ ] Walking east plays east walk animation
- [ ] Walking west plays west walk animation
- [ ] Animation plays at appropriate speed (not too fast or slow)
- [ ] Animation loops smoothly while moving
- [ ] Character returns to static rotation sprite when stopped
- [ ] Static sprite shows correct 8-directional rotation when stopped
- [ ] Smooth transition between walking and standing

## Dependencies
- Ticket 05 (Movement System) must be complete

## Estimated Time
1.5-2 hours

## Testing Checklist

### Animation Loading
- [ ] No 404 errors for animation frames in console
- [ ] All 24 animation frames load (6 frames × 4 directions)
- [ ] PreloadScene creates 4 walk animations

### Animation Playback
Test each direction:
- [ ] Walk north - plays north animation
- [ ] Walk north-east - plays north animation, faces north-east when stopped
- [ ] Walk east - plays east animation
- [ ] Walk south-east - plays south animation, faces south-east when stopped
- [ ] Walk south - plays south animation
- [ ] Walk south-west - plays south animation, faces south-west when stopped
- [ ] Walk west - plays west animation
- [ ] Walk north-west - plays north animation, faces north-west when stopped

### Transition Testing
- [ ] Start walking - animation starts immediately
- [ ] Stop walking - animation stops, shows static sprite
- [ ] Change direction while walking - animation changes smoothly
- [ ] Rapid direction changes - no animation glitches

### Visual Quality
- [ ] Animation frame rate feels natural (10 FPS)
- [ ] No flickering or popping between frames
- [ ] Sprite stays centered during animation
- [ ] Animation loops seamlessly

## Notes
- We have 4 cardinal direction animations but 8 directional static sprites
- Diagonal movement uses nearest cardinal animation for walking (e.g., NE uses north animation)
- When stopped, all 8 directions show their specific rotation sprite
- This creates a nice balance between animation complexity and visual feedback
- Frame rate of 10 FPS provides smooth walking without being too fast
