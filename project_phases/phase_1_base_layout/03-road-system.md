# Ticket 03: Create Road/Path System

## Objective
Create a road system that connects all 4 buildings horizontally, providing a visual path through the town.

## Tasks

### 1. Create Road Tile Assets
We can either use Pixellab MCP to generate road tiles or create them procedurally.

**Option A: Generate with Pixellab MCP**
```typescript
// Request cobblestone road tiles
// - Straight horizontal road
// - Intersection/junction
// - End caps
```

**Option B: Procedural Generation (Faster for MVP)**
Update `src/scenes/PreloadScene.ts`:

```typescript
private createRoadTexture() {
  const graphics = this.add.graphics()

  // Base road color (brown dirt/cobblestone)
  graphics.fillStyle(0x8B7355, 1)
  graphics.fillRect(0, 0, 64, 64)

  // Add cobblestone pattern
  const stoneColors = [0x736357, 0x8B7355, 0x9B8365]

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * 16
      const y = row * 16
      const colorIndex = (row + col) % stoneColors.length

      graphics.fillStyle(stoneColors[colorIndex], 1)
      graphics.fillRect(x + 1, y + 1, 14, 14)
    }
  }

  // Add slight texture variation
  graphics.fillStyle(0x6B5345, 0.3)
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 64
    const y = Math.random() * 64
    const size = Math.random() * 4 + 2
    graphics.fillCircle(x, y, size)
  }

  // Generate texture from graphics
  graphics.generateTexture('road-tile', 64, 64)
  graphics.destroy()
}

preload() {
  // ... existing code ...

  this.createGrassTexture()
  this.createRoadTexture() // Add this
  this.loadPlayerAssets()
}
```

### 2. Create Road Manager Class
Create `src/world/RoadManager.ts`:

```typescript
import Phaser from 'phaser'
import { GAME_CONFIG } from '../config/GameConfig'

export interface BuildingPosition {
  x: number
  y: number
  width: number
  height: number
}

export default class RoadManager {
  private scene: Phaser.Scene
  private roadTileSize: number = 64

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public createMainStreet(buildingPositions: BuildingPosition[]) {
    // Main horizontal road running through center of buildings
    const roadY = 500 // Y position for main street
    const roadWidth = 3 // 3 tiles wide (192px)

    // Calculate road extent (slightly beyond first and last building)
    const minX = Math.min(...buildingPositions.map(b => b.x)) - 200
    const maxX = Math.max(...buildingPositions.map(b => b.x)) + 200

    // Create horizontal road
    this.createHorizontalRoad(minX, maxX, roadY, roadWidth)

    // Create vertical paths from buildings to main street
    buildingPositions.forEach(building => {
      this.createVerticalPath(building.x + building.width / 2, building.y + building.height, roadY)
    })
  }

  private createHorizontalRoad(startX: number, endX: number, y: number, tilesWide: number) {
    const tileSize = this.roadTileSize
    const numTiles = Math.ceil((endX - startX) / tileSize)

    // Center the road vertically around y position
    const startY = y - Math.floor(tilesWide / 2) * tileSize

    for (let row = 0; row < tilesWide; row++) {
      for (let col = 0; col < numTiles; col++) {
        const tileX = startX + col * tileSize
        const tileY = startY + row * tileSize

        this.scene.add.image(tileX, tileY, 'road-tile')
          .setOrigin(0, 0)
          .setDepth(1) // Above grass, below player and buildings
      }
    }
  }

  private createVerticalPath(x: number, startY: number, endY: number) {
    const tileSize = this.roadTileSize
    const pathWidth = 2 // 2 tiles wide (128px)

    // Center the path horizontally around x position
    const startX = x - Math.floor(pathWidth / 2) * tileSize
    const numTiles = Math.ceil(Math.abs(endY - startY) / tileSize)

    for (let row = 0; row < numTiles; row++) {
      for (let col = 0; col < pathWidth; col++) {
        const tileX = startX + col * tileSize
        const tileY = startY + row * tileSize

        this.scene.add.image(tileX, tileY, 'road-tile')
          .setOrigin(0, 0)
          .setDepth(1)
      }
    }
  }

  public createDecorations(buildingPositions: BuildingPosition[]) {
    // Add street lamps along main road
    const roadY = 500

    buildingPositions.forEach((building, index) => {
      // Place lamp posts at regular intervals
      const lampX = building.x + building.width / 2
      const lampYTop = roadY - 150
      const lampYBottom = roadY + 150

      this.createStreetLamp(lampX, lampYTop)
      this.createStreetLamp(lampX, lampYBottom)
    })
  }

  private createStreetLamp(x: number, y: number) {
    // Create a simple street lamp using graphics
    const graphics = this.scene.add.graphics()

    // Lamp post
    graphics.fillStyle(0x3E2723, 1)
    graphics.fillRect(x - 3, y, 6, 40)

    // Lamp top
    graphics.fillStyle(0xFFD700, 1)
    graphics.fillCircle(x, y, 8)

    // Light glow
    graphics.fillStyle(0xFFFF88, 0.3)
    graphics.fillCircle(x, y, 20)

    graphics.setDepth(5)
  }
}
```

### 3. Define Building Positions
Update `src/config/GameConfig.ts`:

```typescript
export const GAME_CONFIG = {
  world: {
    width: 2400,
    height: 800,
  },
  viewport: {
    width: 800,
    height: 600
  },
  player: {
    speed: 120,
    acceleration: 600,
    drag: 400,
    startX: 1200, // Center of world
    startY: 550   // On the main road
  },
  camera: {
    lerp: 0.08,
    deadzone: {
      width: 0,
      height: 0
    }
  },
  buildings: {
    cityHall: { x: 300, y: 200, width: 128, height: 128 },
    socialHall: { x: 800, y: 200, width: 128, height: 128 },
    library: { x: 1300, y: 200, width: 128, height: 128 },
    accountingHouse: { x: 1800, y: 200, width: 128, height: 128 }
  },
  roads: {
    mainStreetY: 500
  }
}
```

### 4. Integrate Road System into GameScene
Update `src/scenes/GameScene.ts`:

```typescript
import RoadManager from '../world/RoadManager'

export default class GameScene extends Phaser.Scene {
  private roadManager!: RoadManager

  create() {
    // Set world bounds
    this.physics.world.setBounds(
      0,
      0,
      GAME_CONFIG.world.width,
      GAME_CONFIG.world.height
    )

    // Create grass field FIRST (layer 0)
    this.createGrassField()

    // Create road system SECOND (layer 1)
    this.roadManager = new RoadManager(this)
    const buildingPositions = [
      GAME_CONFIG.buildings.cityHall,
      GAME_CONFIG.buildings.socialHall,
      GAME_CONFIG.buildings.library,
      GAME_CONFIG.buildings.accountingHouse
    ]
    this.roadManager.createMainStreet(buildingPositions)
    this.roadManager.createDecorations(buildingPositions)

    // Create boundaries THIRD
    this.createBoundaries()

    // Create player on the road
    this.player = new Player(
      this,
      GAME_CONFIG.player.startX,
      GAME_CONFIG.player.startY
    )

    // ... rest of setup ...
  }
}
```

### 5. Add Road Edge Decorations
Optional enhancement - add grass/dirt edges to roads:

```typescript
// In RoadManager.ts

private addRoadEdging(x: number, y: number, width: number, height: number) {
  // Add darker edge pixels to make road distinct
  const graphics = this.scene.add.graphics()
  graphics.lineStyle(2, 0x5D4E37, 1)
  graphics.strokeRect(x, y, width, height)
  graphics.setDepth(2)
}
```

## Testing Checklist

### Road Rendering
- [ ] Road tiles render correctly
- [ ] Road texture is visually distinct from grass
- [ ] Road appears as continuous path (no gaps)
- [ ] Road depth is correct (above grass, below player)

### Road Layout
- [ ] Main horizontal street connects all buildings
- [ ] Vertical paths connect buildings to main street
- [ ] Roads are properly aligned
- [ ] Road width feels appropriate (not too narrow/wide)

### Decorations
- [ ] Street lamps render at intersections
- [ ] Lamp posts are visible and styled appropriately
- [ ] Decorations don't overlap buildings
- [ ] Decorations have correct depth ordering

### Performance
- [ ] No FPS drop from road rendering
- [ ] Road tiles load quickly
- [ ] Smooth scrolling over roads

## Acceptance Criteria
- [ ] Visible road system connecting all 4 building positions
- [ ] Road is distinct from grass background
- [ ] Main horizontal street runs through town
- [ ] Vertical paths connect buildings to street
- [ ] Optional: Street decorations (lamps, etc.)
- [ ] Proper depth ordering (grass < road < player < buildings)
- [ ] 60 FPS maintained

## Dependencies
- Ticket 01 (Expand World) must be complete
- Building positions defined (even if buildings not placed yet)

## Estimated Time
45-60 minutes

## Notes
- Procedural road generation is faster for MVP than generating assets
- Road system establishes the layout before buildings are placed
- Depth management is crucial: grass (0) < road (1) < player (10) < buildings (5)
- Road width should accommodate player movement comfortably
- Consider adding road variations (intersections, crossings) in future phases
