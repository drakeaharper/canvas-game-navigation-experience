# Ticket 02: Implement Center-Locked Camera System

## Objective
Refine the camera system to ensure the player remains perfectly centered in the viewport until reaching world boundaries, where the camera stops and the player can move to edges.

## Background
Phaser's camera.startFollow() with proper bounds automatically provides the desired behavior, but we need to fine-tune settings for optimal feel.

## Tasks

### 1. Verify Camera Follow Settings
The camera should already work correctly from Ticket 01, but let's verify and optimize:

```typescript
// In src/scenes/GameScene.ts - create()

// Set camera bounds to match world
this.cameras.main.setBounds(
  0,
  0,
  GAME_CONFIG.world.width,
  GAME_CONFIG.world.height
)

// Follow player with optimal settings
this.cameras.main.startFollow(
  this.player,
  true,  // roundPixels - prevents sub-pixel rendering
  GAME_CONFIG.camera.lerp,  // 0.08 for smooth following
  GAME_CONFIG.camera.lerp
)

// Set deadzone to 0 to keep player perfectly centered
this.cameras.main.setDeadzone(0, 0)
```

### 2. Add Camera Debug Visualization (Development Only)
Create `src/utils/CameraDebug.ts`:

```typescript
import Phaser from 'phaser'
import { GAME_CONFIG } from '../config/GameConfig'

export default class CameraDebug {
  private scene: Phaser.Scene
  private graphics: Phaser.GameObjects.Graphics
  private enabled: boolean = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.graphics = scene.add.graphics()
    this.graphics.setDepth(1000)
    this.graphics.setScrollFactor(0) // Fixed to camera

    // Toggle with 'C' key
    scene.input.keyboard?.on('keydown-C', () => {
      this.enabled = !this.enabled
      console.log(`Camera debug: ${this.enabled ? 'ON' : 'OFF'}`)
    })
  }

  public update(player: Phaser.Physics.Arcade.Sprite) {
    this.graphics.clear()

    if (!this.enabled) return

    const camera = this.scene.cameras.main
    const playerPos = { x: player.x, y: player.y }

    // Calculate where player is on screen
    const screenX = playerPos.x - camera.scrollX
    const screenY = playerPos.y - camera.scrollY

    // Draw crosshair at player screen position
    this.graphics.lineStyle(2, 0xff0000, 1)

    // Horizontal line
    this.graphics.lineBetween(0, screenY, GAME_CONFIG.viewport.width, screenY)

    // Vertical line
    this.graphics.lineBetween(screenX, 0, screenX, GAME_CONFIG.viewport.height)

    // Draw viewport center point
    const centerX = GAME_CONFIG.viewport.width / 2
    const centerY = GAME_CONFIG.viewport.height / 2

    this.graphics.fillStyle(0x00ff00, 0.5)
    this.graphics.fillCircle(centerX, centerY, 5)

    // Draw text showing camera info
    const distFromCenterX = Math.abs(screenX - centerX)
    const distFromCenterY = Math.abs(screenY - centerY)

    const text = [
      `Camera Scroll: (${Math.round(camera.scrollX)}, ${Math.round(camera.scrollY)})`,
      `Player Screen: (${Math.round(screenX)}, ${Math.round(screenY)})`,
      `Viewport Center: (${centerX}, ${centerY})`,
      `Dist from Center: (${distFromCenterX.toFixed(1)}, ${distFromCenterY.toFixed(1)})`,
      `At World Edge: ${this.isAtWorldEdge(camera)}`
    ]

    // This would need a text object - simplified for now
    console.log(text.join(' | '))
  }

  private isAtWorldEdge(camera: Phaser.Cameras.Scene2D.Camera): string {
    const edges: string[] = []

    if (camera.scrollX <= 0) edges.push('LEFT')
    if (camera.scrollY <= 0) edges.push('TOP')
    if (camera.scrollX >= GAME_CONFIG.world.width - GAME_CONFIG.viewport.width) {
      edges.push('RIGHT')
    }
    if (camera.scrollY >= GAME_CONFIG.world.height - GAME_CONFIG.viewport.height) {
      edges.push('BOTTOM')
    }

    return edges.length > 0 ? edges.join('+') : 'CENTER'
  }
}
```

### 3. Integrate Camera Debug
Update `src/scenes/GameScene.ts`:

```typescript
import CameraDebug from '../utils/CameraDebug'

export default class GameScene extends Phaser.Scene {
  private player!: Player
  private inputManager!: InputManager
  private boundaryEffect!: BoundaryEffect
  private cameraDebug!: CameraDebug

  create() {
    // ... existing setup ...

    // Add camera debug (press C to toggle)
    this.cameraDebug = new CameraDebug(this)

    // ... rest of setup ...
  }

  update(time: number, delta: number) {
    const directionVector = this.inputManager.getDirectionVector()
    const direction8Way = this.inputManager.getDirection8Way()

    this.player.move(directionVector, direction8Way)

    // Update camera debug
    this.cameraDebug.update(this.player)

    // ... boundary collision check ...
  }
}
```

### 4. Add Smooth Camera Transitions
If camera feels too "locked", we can add slight smoothing while maintaining centering:

```typescript
// In GameConfig.ts, adjust lerp value:
camera: {
  lerp: 0.1,  // Slightly higher = more responsive
  deadzone: {
    width: 0,
    height: 0
  }
}

// For instant centering (no smoothing):
camera: {
  lerp: 1.0,  // Instant follow
  deadzone: {
    width: 0,
    height: 0
  }
}
```

### 5. Handle Edge Cases
Ensure camera behaves correctly at world edges:

```typescript
// The camera automatically handles boundaries, but we can verify:

create() {
  // ... camera setup ...

  // Log camera bounds for verification
  console.log('Camera bounds:', {
    x: this.cameras.main.x,
    y: this.cameras.main.y,
    width: this.cameras.main.width,
    height: this.cameras.main.height,
    scrollX: this.cameras.main.scrollX,
    scrollY: this.cameras.main.scrollY
  })

  // Verify player can reach all edges
  console.log('World bounds:', this.physics.world.bounds)
}
```

## Testing Checklist

### Center-Locked Behavior
- [ ] Player starts perfectly centered in viewport
- [ ] Moving in any direction keeps player centered
- [ ] Player crosshair aligns with viewport center (when debug enabled)
- [ ] Distance from center stays at 0 when in world center

### Edge Behavior
- [ ] Moving to left edge: camera stops, player moves left
- [ ] Moving to right edge: camera stops, player moves right
- [ ] Moving to top edge: camera stops, player moves up
- [ ] Moving to bottom edge: camera stops, player moves down
- [ ] Corner behavior: camera stops on both axes

### Camera Smoothing
- [ ] Camera movement feels smooth (not jerky)
- [ ] No "rubber banding" effect
- [ ] Lerp value provides good balance (not too slow/fast)
- [ ] Camera doesn't overshoot player position

### Debug Tools
- [ ] 'C' key toggles camera debug overlay
- [ ] Crosshairs show player screen position
- [ ] Green circle shows viewport center
- [ ] Debug text shows accurate camera info
- [ ] Edge detection correctly identifies boundaries

## Acceptance Criteria
- [ ] Player stays centered during normal movement
- [ ] Camera respects world boundaries
- [ ] Smooth camera interpolation (no jitter)
- [ ] Debug tools work correctly
- [ ] Edge behavior allows player to reach boundaries
- [ ] Performance remains at 60 FPS

## Dependencies
- Ticket 01 (Expand World and Camera) must be complete

## Estimated Time
30-45 minutes

## Notes
- Phaser's camera system handles most of this automatically
- The key is proper configuration, not complex custom code
- Debug tools help verify the camera is working as expected
- Lerp value of 0.08-0.1 provides good balance between smoothness and responsiveness
- Setting deadzone to 0 ensures perfect centering when possible
