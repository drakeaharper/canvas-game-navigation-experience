# Ticket 04: Place Buildings in Horizontal Layout

## Objective
Load and position the 4 primary buildings (City Hall, Social Hall, University Library, Accounting House) in a horizontal layout along the main street.

## Tasks

### 1. Load Building Assets in PreloadScene
Update `src/scenes/PreloadScene.ts`:

```typescript
private loadBuildingAssets() {
  const basePath = 'assets/buildings'

  // Load the 4 primary buildings (64x64 isometric blocks)
  this.load.image('building-city-hall', `${basePath}/city-hall.png`)
  this.load.image('building-social-hall', `${basePath}/social-hall.png`)
  this.load.image('building-library', `${basePath}/university-library.png`)
  this.load.image('building-accounting', `${basePath}/accounting-house.png`)
}

preload() {
  // ... existing code ...

  this.createGrassTexture()
  this.createRoadTexture()
  this.loadPlayerAssets()
  this.loadBuildingAssets() // Add this
}
```

### 2. Create Building Class
Create `src/sprites/Building.ts`:

```typescript
import Phaser from 'phaser'

export enum BuildingType {
  CITY_HALL = 'city-hall',
  SOCIAL_HALL = 'social-hall',
  LIBRARY = 'library',
  ACCOUNTING = 'accounting'
}

export interface BuildingConfig {
  type: BuildingType
  name: string
  description: string
  canvasFeature: string
}

export default class Building extends Phaser.GameObjects.Image {
  private buildingType: BuildingType
  private buildingName: string
  private buildingDescription: string
  private canvasFeature: string

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: BuildingConfig
  ) {
    // Map building type to asset key
    const textureKey = `building-${config.type}`
    super(scene, x, y, textureKey)

    this.buildingType = config.type
    this.buildingName = config.name
    this.buildingDescription = config.description
    this.canvasFeature = config.canvasFeature

    // Add to scene
    scene.add.existing(this)

    // Set origin to bottom-center for isometric placement
    this.setOrigin(0.5, 1)

    // Buildings render above roads but below UI
    this.setDepth(5)

    // Scale if needed (64px tiles might need adjustment)
    this.setScale(2) // Makes 64px -> 128px for better visibility
  }

  public getBuildingType(): BuildingType {
    return this.buildingType
  }

  public getBuildingName(): string {
    return this.buildingName
  }

  public getDescription(): string {
    return this.buildingDescription
  }

  public getCanvasFeature(): string {
    return this.canvasFeature
  }
}
```

### 3. Create Building Manager
Create `src/world/BuildingManager.ts`:

```typescript
import Phaser from 'phaser'
import Building, { BuildingType, BuildingConfig } from '../sprites/Building'
import { GAME_CONFIG } from '../config/GameConfig'

export default class BuildingManager {
  private scene: Phaser.Scene
  private buildings: Map<BuildingType, Building> = new Map()

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public createAllBuildings() {
    // City Hall (Assignments)
    this.createBuilding({
      type: BuildingType.CITY_HALL,
      name: 'City Hall',
      description: 'Assignment Office - View and manage course assignments',
      canvasFeature: 'assignments',
      position: GAME_CONFIG.buildings.cityHall
    })

    // Social Hall (Discussions)
    this.createBuilding({
      type: BuildingType.SOCIAL_HALL,
      name: 'Grand Social Hall',
      description: 'Discussion Tavern - Engage in course discussions',
      canvasFeature: 'discussions',
      position: GAME_CONFIG.buildings.socialHall
    })

    // University Library (Modules)
    this.createBuilding({
      type: BuildingType.LIBRARY,
      name: 'University Library',
      description: 'Learning Library - Navigate course modules',
      canvasFeature: 'modules',
      position: GAME_CONFIG.buildings.library
    })

    // Accounting House (Grades)
    this.createBuilding({
      type: BuildingType.ACCOUNTING,
      name: 'Accounting House',
      description: 'Grade House - Check grades and performance',
      canvasFeature: 'grades',
      position: GAME_CONFIG.buildings.accountingHouse
    })
  }

  private createBuilding(config: {
    type: BuildingType
    name: string
    description: string
    canvasFeature: string
    position: { x: number; y: number }
  }) {
    const buildingConfig: BuildingConfig = {
      type: config.type,
      name: config.name,
      description: config.description,
      canvasFeature: config.canvasFeature
    }

    const building = new Building(
      this.scene,
      config.position.x,
      config.position.y,
      buildingConfig
    )

    this.buildings.set(config.type, building)

    // Add label above building (optional)
    this.createBuildingLabel(building, config.name, config.position)
  }

  private createBuildingLabel(building: Building, name: string, position: { x: number; y: number }) {
    const label = this.scene.add.text(
      position.x,
      position.y - 140, // Above building
      name,
      {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000aa',
        padding: { x: 8, y: 4 }
      }
    )
    label.setOrigin(0.5)
    label.setDepth(6) // Above buildings
  }

  public getBuilding(type: BuildingType): Building | undefined {
    return this.buildings.get(type)
  }

  public getAllBuildings(): Building[] {
    return Array.from(this.buildings.values())
  }

  public getBuildingAt(x: number, y: number): Building | null {
    for (const building of this.buildings.values()) {
      const bounds = building.getBounds()
      if (bounds.contains(x, y)) {
        return building
      }
    }
    return null
  }
}
```

### 4. Integrate Buildings into GameScene
Update `src/scenes/GameScene.ts`:

```typescript
import BuildingManager from '../world/BuildingManager'

export default class GameScene extends Phaser.Scene {
  private roadManager!: RoadManager
  private buildingManager!: BuildingManager

  create() {
    // 1. Physics world
    this.physics.world.setBounds(
      0,
      0,
      GAME_CONFIG.world.width,
      GAME_CONFIG.world.height
    )

    // 2. Grass field (layer 0)
    this.createGrassField()

    // 3. Roads (layer 1)
    this.roadManager = new RoadManager(this)
    const buildingPositions = [
      GAME_CONFIG.buildings.cityHall,
      GAME_CONFIG.buildings.socialHall,
      GAME_CONFIG.buildings.library,
      GAME_CONFIG.buildings.accountingHouse
    ]
    this.roadManager.createMainStreet(buildingPositions)
    this.roadManager.createDecorations(buildingPositions)

    // 4. Boundaries
    this.createBoundaries()

    // 5. Buildings (layer 5)
    this.buildingManager = new BuildingManager(this)
    this.buildingManager.createAllBuildings()

    // 6. Player (layer 10)
    this.player = new Player(
      this,
      GAME_CONFIG.player.startX,
      GAME_CONFIG.player.startY
    )

    // ... rest of setup (camera, input, UI) ...
  }
}
```

### 5. Adjust Building Positions for Optimal Layout
Fine-tune positions in `src/config/GameConfig.ts`:

```typescript
export const GAME_CONFIG = {
  // ... existing config ...

  buildings: {
    // Positions are bottom-center of building (where it touches ground)
    cityHall: {
      x: 400,    // Left side of town
      y: 400,    // Y position where building base touches ground
      width: 128,
      height: 128
    },
    socialHall: {
      x: 900,    // Left-center
      y: 400,
      width: 128,
      height: 128
    },
    library: {
      x: 1500,   // Right-center
      y: 400,
      width: 128,
      height: 128
    },
    accountingHouse: {
      x: 2000,   // Right side of town
      y: 400,
      width: 128,
      height: 128
    }
  },
  roads: {
    mainStreetY: 500  // Road runs south of buildings
  }
}
```

### 6. Add Building Name Tags (Optional Enhancement)
Buildings already have labels from BuildingManager, but we can enhance them:

```typescript
// In BuildingManager.ts - createBuildingLabel()

private createBuildingLabel(building: Building, name: string, position: { x: number; y: number }) {
  // Background plate
  const bg = this.scene.add.graphics()
  bg.fillStyle(0x000000, 0.8)
  bg.fillRoundedRect(position.x - 60, position.y - 150, 120, 30, 8)
  bg.setDepth(6)

  // Building name
  const label = this.scene.add.text(
    position.x,
    position.y - 135,
    name,
    {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    }
  )
  label.setOrigin(0.5)
  label.setDepth(7)

  // Building icon/emoji (optional)
  const icons: Record<string, string> = {
    'City Hall': '🏛️',
    'Grand Social Hall': '🎭',
    'University Library': '📚',
    'Accounting House': '📊'
  }

  const icon = this.scene.add.text(
    position.x,
    position.y - 180,
    icons[name] || '🏢',
    {
      fontSize: '24px'
    }
  )
  icon.setOrigin(0.5)
  icon.setDepth(7)
}
```

## Testing Checklist

### Building Loading
- [ ] All 4 building images load without errors
- [ ] No 404 errors in console
- [ ] Building textures are correct size (64x64)

### Building Placement
- [ ] City Hall appears on left (west) side
- [ ] Social Hall appears left-center
- [ ] Library appears right-center
- [ ] Accounting House appears on right (east) side
- [ ] Buildings are horizontally aligned
- [ ] Buildings are evenly spaced

### Visual Appearance
- [ ] Buildings render with correct isometric perspective
- [ ] Buildings face south (entrance visible to player)
- [ ] Building scale is appropriate (not too large/small)
- [ ] Buildings render above roads
- [ ] Building labels are visible and readable

### Depth Ordering
- [ ] Grass (0) < Roads (1) < Buildings (5) < Labels (6) < Player (10)
- [ ] No z-fighting or overlap issues
- [ ] Player can walk behind buildings if needed

### Layout
- [ ] Buildings aligned with road system
- [ ] Spacing allows comfortable navigation
- [ ] Horizontal layout feels balanced
- [ ] Camera can see 1-2 buildings at a time

## Acceptance Criteria
- [ ] All 4 buildings successfully loaded and placed
- [ ] Buildings positioned in horizontal layout
- [ ] Proper depth ordering maintained
- [ ] Building labels display correctly
- [ ] Buildings visually aligned with roads
- [ ] Layout feels balanced and navigable
- [ ] 60 FPS maintained

## Dependencies
- Ticket 03 (Road System) must be complete
- Building assets must exist in `public/assets/buildings/`

## Estimated Time
45-60 minutes

## Notes
- Buildings are Image objects (not Sprites) since they don't move
- Origin set to (0.5, 1) for bottom-center anchor point (isometric standard)
- Scale of 2x makes 64px buildings more visible (128px total)
- Labels help players identify buildings until interactions are added
- BuildingManager provides centralized control for all buildings
- Future phases will add collision, interactions, and state indicators
