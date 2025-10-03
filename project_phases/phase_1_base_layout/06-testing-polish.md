# Ticket 06: Testing and Polish

## Objective
Comprehensive testing of the Phase 1 base layout, polish rough edges, and ensure a high-quality experience before moving to Phase 2 (building interactions).

## Tasks

### 1. Comprehensive World Navigation Testing

#### East-West Navigation
```
Test Path: Start → Walk to leftmost building → Walk to rightmost building
```

**Verification Points:**
- [ ] Camera centers player in middle of world
- [ ] Camera stops at left edge (x ≤ 400)
- [ ] Camera stops at right edge (x ≥ 2000)
- [ ] Player can move to extreme edges within viewport
- [ ] Smooth camera transition when changing direction
- [ ] All buildings visible during journey

#### North-South Navigation
```
Test Path: Walk to top boundary → Walk to bottom boundary
```

**Verification Points:**
- [ ] Camera stops at top edge (y ≤ 300)
- [ ] Camera stops at bottom edge (y ≥ 500)
- [ ] Player can reach all road areas
- [ ] Vertical movement feels natural

#### Diagonal Navigation
```
Test Path: NW corner → SE corner, SW corner → NE corner
```

**Verification Points:**
- [ ] Camera handles diagonal movement smoothly
- [ ] Both axes stop at boundaries independently
- [ ] No jittering or stuttering during diagonal movement

### 2. Building Interaction Testing

#### Collision Testing
```
For each building: Approach from N, S, E, W, and diagonally
```

- [ ] City Hall collision from all angles
- [ ] Social Hall collision from all angles
- [ ] Library collision from all angles
- [ ] Accounting House collision from all angles
- [ ] No clipping through buildings
- [ ] Smooth sliding along building edges

#### Building Spacing
- [ ] Adequate space between buildings for navigation
- [ ] No "trapped" areas where player gets stuck
- [ ] Can walk comfortably on roads between buildings
- [ ] Buildings don't feel too cramped or too far apart

### 3. Visual Polish

#### Depth Ordering Verification
Walk behind/in front of all objects and verify layering:
- [ ] Grass (0) appears below everything
- [ ] Roads (1) appear above grass
- [ ] Buildings (5) appear above roads
- [ ] Building labels (6-7) appear above buildings
- [ ] Player (10) appears above buildings when in front
- [ ] Player appears behind buildings when behind (test Y-sorting if needed)

#### Visual Consistency
- [ ] All building sprites have consistent art style
- [ ] Road texture looks cohesive
- [ ] Grass pattern is not distracting
- [ ] Boundaries are visible but not obtrusive
- [ ] Street lamps (if added) are evenly placed
- [ ] Overall aesthetic feels unified

### 4. Performance Optimization

#### Frame Rate Testing
- [ ] Maintain 60 FPS when standing still
- [ ] Maintain 60 FPS when moving
- [ ] Maintain 60 FPS when camera scrolling
- [ ] No frame drops when passing buildings
- [ ] Monitor FPS for 5+ minutes (check for memory leaks)

#### Asset Loading
- [ ] All assets load within reasonable time (< 2 seconds)
- [ ] Loading bar shows progress accurately
- [ ] No flash of unstyled content
- [ ] Graceful fallback if assets fail to load

### 5. UI Polish

#### Debug Information
Update UI to be more helpful:

```typescript
// In GameScene.ts - createUI()

private createUI() {
  const infoText = this.add.text(10, 10, '', {
    fontSize: '13px',
    color: '#ffffff',
    backgroundColor: '#000000dd',
    padding: { x: 10, y: 6 },
    fontFamily: 'monospace'
  }).setScrollFactor(0).setDepth(100)

  const fpsText = this.add.text(
    GAME_CONFIG.viewport.width - 10,
    10,
    '',
    {
      fontSize: '12px',
      color: '#00ff00',
      backgroundColor: '#000000dd',
      padding: { x: 8, y: 4 },
      fontFamily: 'monospace'
    }
  ).setScrollFactor(0).setDepth(100).setOrigin(1, 0)

  this.events.on('postupdate', () => {
    const pos = this.player.getPosition()
    const velocity = this.player.getVelocity()
    const speed = velocity.length().toFixed(0)
    const direction = this.player.getCurrentDirection()

    // Determine nearest building
    const nearestBuilding = this.getNearestBuilding()

    infoText.setText([
      '🎮 Canvas Course World - Phase 1',
      '⌨️  Arrow Keys or WASD to move',
      '',
      `📍 Position: (${Math.round(pos.x)}, ${Math.round(pos.y)})`,
      `🗺️  World: ${GAME_CONFIG.world.width}×${GAME_CONFIG.world.height}px`,
      `🧭 Direction: ${direction}`,
      `⚡ Speed: ${speed} px/s`,
      nearestBuilding ? `🏛️  Near: ${nearestBuilding}` : ''
    ].filter(line => line)) // Remove empty strings

    const fps = Math.round(this.game.loop.actualFps)
    fpsText.setText(`FPS: ${fps}`)

    if (fps >= 55) fpsText.setColor('#00ff00')
    else if (fps >= 30) fpsText.setColor('#ffff00')
    else fpsText.setColor('#ff0000')
  })
}

private getNearestBuilding(): string | null {
  const playerPos = this.player.getPosition()
  const buildings = this.buildingManager.getAllBuildings()

  let nearest: { building: any, distance: number } | null = null

  buildings.forEach(building => {
    const dx = building.x - playerPos.x
    const dy = building.y - playerPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (!nearest || distance < nearest.distance) {
      nearest = { building, distance }
    }
  })

  if (nearest && nearest.distance < 300) {
    return nearest.building.getBuildingName()
  }

  return null
}
```

### 6. Add Helpful Overlays

#### Minimap (Optional)
```typescript
// In GameScene.ts

private createMinimap() {
  const minimapSize = 150
  const minimap = this.add.graphics()
  minimap.setScrollFactor(0)
  minimap.setDepth(200)

  // Position in bottom-right
  const mapX = GAME_CONFIG.viewport.width - minimapSize - 10
  const mapY = GAME_CONFIG.viewport.height - minimapSize - 10

  // Update in postupdate
  this.events.on('postupdate', () => {
    minimap.clear()

    // Background
    minimap.fillStyle(0x000000, 0.7)
    minimap.fillRect(mapX, mapY, minimapSize, minimapSize)

    // World scale
    const scaleX = minimapSize / GAME_CONFIG.world.width
    const scaleY = minimapSize / GAME_CONFIG.world.height

    // Draw buildings
    minimap.fillStyle(0x8B4513, 1)
    this.buildingManager.getAllBuildings().forEach(building => {
      const x = mapX + building.x * scaleX
      const y = mapY + building.y * scaleY
      minimap.fillRect(x - 2, y - 2, 4, 4)
    })

    // Draw player
    const playerPos = this.player.getPosition()
    const playerX = mapX + playerPos.x * scaleX
    const playerY = mapY + playerPos.y * scaleY
    minimap.fillStyle(0x00ff00, 1)
    minimap.fillCircle(playerX, playerY, 3)

    // Border
    minimap.lineStyle(2, 0xffffff, 1)
    minimap.strokeRect(mapX, mapY, minimapSize, minimapSize)
  })
}
```

### 7. Edge Case Handling

#### Player Spawn Location
- [ ] Player spawns in accessible location (not inside building)
- [ ] Player spawns on road
- [ ] Spawn location is centered on screen initially

#### Boundary Edge Cases
- [ ] Player can't get stuck in corners
- [ ] Boundary collision feels natural
- [ ] No gaps in boundary where player can escape

#### Building Edge Cases
- [ ] Player can't get wedged between buildings
- [ ] Collision response is consistent
- [ ] No "sticking" to buildings when sliding past

### 8. Documentation Updates

#### Update README
Add Phase 1 status to main README.md:

```markdown
### Phase 1: Base Layout ✅ Complete
- Expanded world (2400×800)
- Center-locked camera system
- 4 primary buildings placed
- Road system connecting buildings
- Building collision detection
```

#### Create Phase 1 README
Create `project_phases/phase_1_base_layout/README.md`:

```markdown
# Phase 1: Base Layout - COMPLETE

## Implemented Features
- ✅ Expanded game world (2400×800)
- ✅ Center-locked camera with edge boundaries
- ✅ Horizontal town layout with 4 buildings
- ✅ Road system connecting all buildings
- ✅ Building collision detection
- ✅ Smooth camera transitions
- ✅ Performance optimization (60 FPS)

## Buildings
1. City Hall (Assignments) - West side
2. Grand Social Hall (Discussions) - Center-west
3. University Library (Modules) - Center-east
4. Accounting House (Grades) - East side

## Controls
- Arrow Keys / WASD: Move character
- F: Toggle fullscreen
- R: Restart scene
- P: Pause/resume
- C: Toggle camera debug (if enabled)

## Technical Details
- World Size: 2400×800 pixels
- Viewport: 800×600 pixels
- Camera: Center-locked with boundary constraints
- Buildings: Static physics bodies with collision
- Depth Layers: Grass (0) → Roads (1) → Buildings (5) → Player (10)

## Next Steps (Phase 2)
- Building interaction zones
- Enter/exit building animations
- Building state indicators
- Canvas API integration
```

## Final Testing Checklist

### Critical Path Testing
- [ ] Can navigate from spawn to each building
- [ ] Can walk entire perimeter of world
- [ ] No crashes or console errors
- [ ] All buildings are accessible

### User Experience
- [ ] Movement feels responsive
- [ ] Camera behavior is intuitive
- [ ] Buildings feel solid and real
- [ ] World feels cohesive and polished

### Performance
- [ ] 60 FPS maintained throughout
- [ ] No memory leaks after extended play
- [ ] Asset loading is fast
- [ ] No visual glitches

## Acceptance Criteria
- [ ] All 6 tickets complete
- [ ] All testing checkpoints passed
- [ ] No critical bugs
- [ ] Documentation updated
- [ ] Code is clean and commented
- [ ] Ready for Phase 2 development

## Dependencies
- Tickets 01-05 must all be complete

## Estimated Time
1.5-2 hours

## Notes
- This ticket is primarily testing and polish
- Take time to play-test thoroughly
- Get feedback from others if possible
- Document any issues for future phases
- Celebrate completing Phase 1! 🎉
