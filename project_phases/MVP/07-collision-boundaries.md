# Ticket 07: Add Collision Boundaries and Polish

## Objective
Add invisible boundary collision to keep the player within the playable area and add visual feedback for boundaries.

## Tasks

### 1. Create Boundary Visualization
Update `src/scenes/GameScene.ts` to add visual boundaries:

```typescript
import Phaser from 'phaser'
import Player from '../sprites/Player'
import InputManager from '../utils/InputManager'
import { GAME_CONFIG } from '../config/GameConfig'

export default class GameScene extends Phaser.Scene {
  private player!: Player
  private inputManager!: InputManager
  private boundaries!: Phaser.Physics.Arcade.StaticGroup

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
    this.createBoundaries()

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

  private createBoundaries() {
    this.boundaries = this.physics.add.staticGroup()

    const borderWidth = 8
    const worldWidth = GAME_CONFIG.world.width
    const worldHeight = GAME_CONFIG.world.height

    // Create visual boundary rectangles
    const borderColor = 0x8B4513 // Brown color for fence
    const graphics = this.add.graphics()
    graphics.fillStyle(borderColor, 1)

    // Top border
    graphics.fillRect(0, 0, worldWidth, borderWidth)

    // Bottom border
    graphics.fillRect(0, worldHeight - borderWidth, worldWidth, borderWidth)

    // Left border
    graphics.fillRect(0, 0, borderWidth, worldHeight)

    // Right border
    graphics.fillRect(worldWidth - borderWidth, 0, borderWidth, worldHeight)

    // Add decorative corner posts
    this.createCornerPosts()
  }

  private createCornerPosts() {
    const postSize = 16
    const positions = [
      { x: 0, y: 0 }, // Top-left
      { x: GAME_CONFIG.world.width - postSize, y: 0 }, // Top-right
      { x: 0, y: GAME_CONFIG.world.height - postSize }, // Bottom-left
      { x: GAME_CONFIG.world.width - postSize, y: GAME_CONFIG.world.height - postSize } // Bottom-right
    ]

    positions.forEach(pos => {
      const graphics = this.add.graphics()
      graphics.fillStyle(0x654321, 1) // Darker brown for posts
      graphics.fillRect(pos.x, pos.y, postSize, postSize)

      // Add a lighter top for 3D effect
      graphics.fillStyle(0x8B6914, 1)
      graphics.fillRect(pos.x, pos.y, postSize, 4)
    })
  }

  private createUI() {
    const text = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(100)

    this.events.on('postupdate', () => {
      const velocity = this.player.getVelocity()
      const speed = velocity.length().toFixed(0)
      const direction = this.player.getCurrentDirection()
      const pos = this.player.getPosition()

      text.setText([
        'Canvas Course World - MVP',
        'Use Arrow Keys or WASD to move',
        '',
        `Position: (${Math.round(pos.x)}, ${Math.round(pos.y)})`,
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

### 2. Update Player Class with Position Helper
Add to `src/sprites/Player.ts`:

```typescript
public getPosition(): { x: number, y: number } {
  return { x: this.x, y: this.y }
}
```

### 3. Add Visual Feedback for Boundary Collision
Create `src/effects/BoundaryEffect.ts`:

```typescript
import Phaser from 'phaser'

export default class BoundaryEffect {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public showBoundaryHit(x: number, y: number, direction: 'top' | 'bottom' | 'left' | 'right') {
    // Create a small impact effect
    const particle = this.scene.add.circle(x, y, 4, 0xFFFFFF, 0.8)
    particle.setDepth(5)

    // Fade out and destroy
    this.scene.tweens.add({
      targets: particle,
      alpha: 0,
      scale: 2,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        particle.destroy()
      }
    })
  }
}
```

### 4. Integrate Boundary Effect
Update `src/sprites/Player.ts` to detect boundary collisions:

```typescript
// Add to Player class
private lastBoundaryHitTime: number = 0
private boundaryHitCooldown: number = 200 // ms

// Add after physics setup in constructor
body.setCollideWorldBounds(true)

// Override the update method to detect boundary collisions
public checkBoundaryCollision(worldBounds: Phaser.Geom.Rectangle, time: number): boolean {
  const body = this.body as Phaser.Physics.Arcade.Body

  // Only check if enough time has passed since last hit
  if (time - this.lastBoundaryHitTime < this.boundaryHitCooldown) {
    return false
  }

  let hitBoundary = false

  if (body.blocked.up || body.blocked.down || body.blocked.left || body.blocked.right) {
    hitBoundary = true
    this.lastBoundaryHitTime = time
  }

  return hitBoundary
}
```

### 5. Update GameScene to Use Boundary Effects
```typescript
import BoundaryEffect from '../effects/BoundaryEffect'

// Add to GameScene
private boundaryEffect!: BoundaryEffect

// In create():
this.boundaryEffect = new BoundaryEffect(this)

// In update():
update(time: number, delta: number) {
  const directionVector = this.inputManager.getDirectionVector()
  const direction8Way = this.inputManager.getDirection8Way()

  this.player.move(directionVector, direction8Way)

  // Check for boundary collision
  const worldBounds = this.physics.world.bounds
  if (this.player.checkBoundaryCollision(worldBounds, time)) {
    const pos = this.player.getPosition()

    // Determine which boundary was hit
    let direction: 'top' | 'bottom' | 'left' | 'right' = 'top'

    if (pos.y <= 20) direction = 'top'
    else if (pos.y >= worldBounds.height - 20) direction = 'bottom'
    else if (pos.x <= 20) direction = 'left'
    else if (pos.x >= worldBounds.width - 20) direction = 'right'

    this.boundaryEffect.showBoundaryHit(pos.x, pos.y, direction)
  }
}
```

## Acceptance Criteria
- [ ] Player cannot move outside the game boundaries
- [ ] Visual borders render around the play area
- [ ] Corner posts add decorative elements
- [ ] Subtle effect plays when player hits boundary
- [ ] Player can move freely within boundaries
- [ ] Collision detection is smooth and responsive
- [ ] UI shows current player position
- [ ] No glitching or jittery movement near boundaries

## Dependencies
- Ticket 06 (Walk Animations) must be complete

## Estimated Time
1-1.5 hours

## Testing Checklist

### Boundary Collision
- [ ] Walk into top boundary - player stops, can't move further up
- [ ] Walk into bottom boundary - player stops, can't move further down
- [ ] Walk into left boundary - player stops, can't move further left
- [ ] Walk into right boundary - player stops, can't move further right
- [ ] Walk diagonally into corner - player stops at both boundaries

### Visual Feedback
- [ ] Brown borders visible around play area
- [ ] Corner posts render correctly
- [ ] Boundary hit effect displays when hitting walls
- [ ] Effect doesn't spam (cooldown works)

### Movement Feel
- [ ] No bouncing off boundaries
- [ ] Can move along boundaries smoothly
- [ ] Can exit boundary by moving away from it
- [ ] Collision feels natural, not sticky

### UI
- [ ] Position coordinates update in real-time
- [ ] Position shows boundary proximity (near 0 or max values)

## Notes
- `collideWorldBounds` prevents the physics body from exiting the world
- Visual boundaries provide clear feedback about play area limits
- Boundary hit effect gives subtle feedback without being distracting
- Cooldown prevents effect spam when holding against wall
