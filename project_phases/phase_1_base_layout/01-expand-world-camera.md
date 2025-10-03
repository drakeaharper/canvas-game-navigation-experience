# Ticket 01: Expand World Size and Update Camera Bounds

## Objective
Expand the game world to accommodate multiple buildings in a horizontal layout and configure the camera to properly track the expanded world.

## Tasks

### 1. Update Game Configuration
Update `src/config/GameConfig.ts`:

```typescript
export const GAME_CONFIG = {
  world: {
    width: 2400,  // Expanded from 800
    height: 800,  // Expanded from 600
  },
  viewport: {
    width: 800,
    height: 600
  },
  player: {
    speed: 120,
    acceleration: 600,
    drag: 400
  },
  camera: {
    lerp: 0.08,  // Slightly smoother for larger world
    deadzone: {
      width: 0,   // No deadzone - player stays centered
      height: 0
    }
  }
}
```

### 2. Update GameScene World Bounds
Update `src/scenes/GameScene.ts`:

```typescript
create() {
  // Set expanded world bounds
  this.physics.world.setBounds(
    0,
    0,
    GAME_CONFIG.world.width,
    GAME_CONFIG.world.height
  )

  // Create expanded grass field
  this.createGrassField()
  this.createBoundaries()

  // Create player in CENTER of expanded world
  const centerX = GAME_CONFIG.world.width / 2
  const centerY = GAME_CONFIG.world.height / 2
  this.player = new Player(this, centerX, centerY)

  // ... rest of setup
}

private createGrassField() {
  const tileSize = 64
  const cols = Math.ceil(GAME_CONFIG.world.width / tileSize)
  const rows = Math.ceil(GAME_CONFIG.world.height / tileSize)

  // Fill the entire expanded world with grass tiles
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      this.add.image(x * tileSize, y * tileSize, 'grass-tile')
        .setOrigin(0, 0)
    }
  }
}

private createBoundaries() {
  const borderWidth = 8
  const worldWidth = GAME_CONFIG.world.width
  const worldHeight = GAME_CONFIG.world.height

  // Create visual boundary rectangles for expanded world
  const borderColor = 0x8B4513
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

  // Update corner posts for expanded world
  this.createCornerPosts()
}

private createCornerPosts() {
  const postSize = 16
  const positions = [
    { x: 0, y: 0 },
    { x: GAME_CONFIG.world.width - postSize, y: 0 },
    { x: 0, y: GAME_CONFIG.world.height - postSize },
    { x: GAME_CONFIG.world.width - postSize, y: GAME_CONFIG.world.height - postSize }
  ]

  positions.forEach(pos => {
    const graphics = this.add.graphics()
    graphics.fillStyle(0x654321, 1)
    graphics.fillRect(pos.x, pos.y, postSize, postSize)

    graphics.fillStyle(0x8B6914, 1)
    graphics.fillRect(pos.x, pos.y, postSize, 4)
  })
}
```

### 3. Update Camera Configuration
Update camera setup in `src/scenes/GameScene.ts`:

```typescript
create() {
  // ... world setup ...

  // Camera setup with proper bounds
  this.cameras.main.setBounds(
    0,
    0,
    GAME_CONFIG.world.width,
    GAME_CONFIG.world.height
  )

  // Set camera to follow player with smooth lerp
  this.cameras.main.startFollow(
    this.player,
    true,
    GAME_CONFIG.camera.lerp,
    GAME_CONFIG.camera.lerp
  )

  // Optional: Set deadzone to 0 to keep player perfectly centered
  // (Camera will stop scrolling at world boundaries automatically)
  this.cameras.main.setDeadzone(0, 0)

  // ... rest of setup ...
}
```

### 4. Update UI to Show World Position
Update `src/scenes/GameScene.ts` UI creation:

```typescript
private createUI() {
  const infoText = this.add.text(10, 10, '', {
    fontSize: '14px',
    color: '#ffffff',
    backgroundColor: '#000000',
    padding: { x: 8, y: 4 }
  }).setScrollFactor(0).setDepth(100)

  const fpsText = this.add.text(
    GAME_CONFIG.viewport.width - 10,  // Use viewport width, not world width
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
      'Canvas Course World - Phase 1',
      'Use Arrow Keys or WASD to move',
      `Position: (${Math.round(pos.x)}, ${Math.round(pos.y)})`,
      `World: ${GAME_CONFIG.world.width}×${GAME_CONFIG.world.height}`,
      `Direction: ${direction}`,
      `Speed: ${speed} px/s`
    ])

    const fps = Math.round(this.game.loop.actualFps)
    fpsText.setText(`FPS: ${fps}`)

    if (fps >= 55) {
      fpsText.setColor('#00ff00')
    } else if (fps >= 30) {
      fpsText.setColor('#ffff00')
    } else {
      fpsText.setColor('#ff0000')
    }
  })
}
```

### 5. Update Game Config Export
Ensure `src/game.ts` uses viewport dimensions for canvas:

```typescript
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,   // Viewport width (not world width)
  height: 600,  // Viewport height (not world height)
  backgroundColor: '#87CEEB',
  // ... rest of config
}
```

## Testing Checklist

### World Expansion
- [ ] World is 2400×800 (3x wider, 1.33x taller)
- [ ] Grass tiles fill entire expanded world
- [ ] Boundaries render at all 4 edges
- [ ] Corner posts appear at all 4 corners

### Camera Behavior
- [ ] Player starts in center of world
- [ ] Camera keeps player centered when moving
- [ ] Camera stops scrolling at left edge (player can move to x=0)
- [ ] Camera stops scrolling at right edge (player can move to x=2400)
- [ ] Camera stops scrolling at top edge (player can move to y=0)
- [ ] Camera stops scrolling at bottom edge (player can move to y=800)
- [ ] Camera movement is smooth (no jitter)

### Performance
- [ ] FPS remains above 55 with expanded world
- [ ] No performance degradation when moving
- [ ] Grass tile rendering is efficient

### UI
- [ ] Debug text shows correct world position
- [ ] World size displays as 2400×800
- [ ] FPS counter stays in top-right corner
- [ ] UI elements remain fixed to viewport (not world)

## Acceptance Criteria
- [ ] World is successfully expanded to 2400×800
- [ ] Camera follows player smoothly
- [ ] Camera respects world boundaries
- [ ] Player can navigate entire expanded world
- [ ] UI shows accurate world position
- [ ] 60 FPS maintained
- [ ] No visual glitches or boundary issues

## Dependencies
None - this builds on MVP

## Estimated Time
45 minutes

## Notes
- The camera will automatically stop at boundaries - Phaser handles this natively
- Player can move within the viewport when at edges, creating the "window" effect
- Larger world = more grass tiles, but performance should remain good
- This sets the foundation for building placement in next tickets
