# Ticket 05: Add Building Collision

## Objective
Implement collision detection so players cannot walk through buildings, making them feel like solid objects in the world.

## Tasks

### 1. Update Building Class to Support Physics
Update `src/sprites/Building.ts`:

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

export default class Building extends Phaser.Physics.Arcade.Image {
  // Changed from GameObjects.Image to Physics.Arcade.Image
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
    const textureKey = `building-${config.type}`
    super(scene, x, y, textureKey)

    this.buildingType = config.type
    this.buildingName = config.name
    this.buildingDescription = config.description
    this.canvasFeature = config.canvasFeature

    // Add to scene and physics
    scene.add.existing(this)
    scene.physics.add.existing(this, true) // true = static body

    // Configure physics body
    const body = this.body as Phaser.Physics.Arcade.StaticBody

    // Set collision box based on building footprint
    // Buildings are 64px but scaled 2x = 128px
    // Collision should be smaller than visual to allow some overlap
    body.setSize(100, 60)  // Smaller than visual size
    body.setOffset(14, 58) // Adjust to align with building base

    // Set origin to bottom-center for isometric placement
    this.setOrigin(0.5, 1)

    // Buildings render above roads
    this.setDepth(5)

    // Scale for visibility
    this.setScale(2)
  }

  // ... rest of existing methods ...
}
```

### 2. Update BuildingManager to Handle Collisions
Update `src/world/BuildingManager.ts`:

```typescript
import Phaser from 'phaser'
import Building, { BuildingType, BuildingConfig } from '../sprites/Building'
import { GAME_CONFIG } from '../config/GameConfig'
import Player from '../sprites/Player'

export default class BuildingManager {
  private scene: Phaser.Scene
  private buildings: Map<BuildingType, Building> = new Map()

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public createAllBuildings() {
    // ... existing building creation ...
  }

  public setupCollisions(player: Player) {
    // Create collision between player and all buildings
    this.buildings.forEach(building => {
      this.scene.physics.add.collider(player, building)
    })
  }

  // ... rest of existing methods ...
}
```

### 3. Update GameScene to Enable Collisions
Update `src/scenes/GameScene.ts`:

```typescript
create() {
  // ... existing world setup ...

  // Create grass field (layer 0)
  this.createGrassField()

  // Create roads (layer 1)
  this.roadManager = new RoadManager(this)
  const buildingPositions = [
    GAME_CONFIG.buildings.cityHall,
    GAME_CONFIG.buildings.socialHall,
    GAME_CONFIG.buildings.library,
    GAME_CONFIG.buildings.accountingHouse
  ]
  this.roadManager.createMainStreet(buildingPositions)
  this.roadManager.createDecorations(buildingPositions)

  // Create boundaries
  this.createBoundaries()

  // Create buildings (layer 5)
  this.buildingManager = new BuildingManager(this)
  this.buildingManager.createAllBuildings()

  // Create player (layer 10)
  this.player = new Player(
    this,
    GAME_CONFIG.player.startX,
    GAME_CONFIG.player.startY
  )

  // Setup collisions AFTER player and buildings exist
  this.buildingManager.setupCollisions(this.player)

  // ... rest of setup (input, camera, UI) ...
}
```

### 4. Add Visual Collision Debug (Optional)
Update `src/game.ts` to toggle debug mode:

```typescript
const DEBUG_MODE = true // Set to true to see collision boxes

export const gameConfig: Phaser.Types.Core.GameConfig = {
  // ... existing config ...
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: DEBUG_MODE // Shows collision boxes
    }
  },
  // ... rest of config ...
}
```

### 5. Fine-Tune Collision Boxes
Each building may need different collision box sizes based on their visual footprint.

Update `src/sprites/Building.ts`:

```typescript
constructor(
  scene: Phaser.Scene,
  x: number,
  y: number,
  config: BuildingConfig
) {
  // ... existing code ...

  // Set collision box based on building type
  const collisionConfig = this.getCollisionConfig()

  const body = this.body as Phaser.Physics.Arcade.StaticBody
  body.setSize(collisionConfig.width, collisionConfig.height)
  body.setOffset(collisionConfig.offsetX, collisionConfig.offsetY)

  // ... rest of constructor ...
}

private getCollisionConfig(): {
  width: number
  height: number
  offsetX: number
  offsetY: number
} {
  // Collision configs based on building visual appearance
  // Buildings are 64px base, scaled 2x = 128px visual size

  switch (this.buildingType) {
    case BuildingType.CITY_HALL:
      // Grand building with columns - wider base
      return {
        width: 110,
        height: 65,
        offsetX: 9,
        offsetY: 53
      }

    case BuildingType.SOCIAL_HALL:
      // Theater building - medium footprint
      return {
        width: 100,
        height: 60,
        offsetX: 14,
        offsetY: 58
      }

    case BuildingType.LIBRARY:
      // Tall building - smaller base
      return {
        width: 95,
        height: 55,
        offsetX: 16.5,
        offsetY: 63
      }

    case BuildingType.ACCOUNTING:
      // Commercial building - medium footprint
      return {
        width: 100,
        height: 60,
        offsetX: 14,
        offsetY: 58
      }

    default:
      return {
        width: 100,
        height: 60,
        offsetX: 14,
        offsetY: 58
      }
  }
}
```

### 6. Add Collision Feedback (Optional Enhancement)
Add subtle feedback when player collides with buildings:

```typescript
// In BuildingManager.ts - setupCollisions()

public setupCollisions(player: Player) {
  this.buildings.forEach(building => {
    const collider = this.scene.physics.add.collider(player, building)

    // Optional: Add collision callback for feedback
    collider.overlapOnly = false

    // Could add sound effect or visual feedback here
    // collider.collideCallback = () => {
    //   // Play "thud" sound
    //   // Show collision particle
    // }
  })
}
```

## Testing Checklist

### Collision Detection
- [ ] Player cannot walk through City Hall
- [ ] Player cannot walk through Social Hall
- [ ] Player cannot walk through Library
- [ ] Player cannot walk through Accounting House
- [ ] Collision stops player smoothly (no bouncing)

### Collision Box Sizing
- [ ] Collision boxes match building footprints
- [ ] Some visual overlap is acceptable (isometric perspective)
- [ ] Player can walk close to buildings without weird gaps
- [ ] Collision boxes don't extend beyond visual bounds

### Collision Feel
- [ ] Collision feels natural (not too rigid)
- [ ] Player can slide along building edges
- [ ] No stuttering or jitter when touching buildings
- [ ] Diagonal approaches work correctly

### Debug Visualization
- [ ] Debug mode shows collision boxes correctly
- [ ] Collision boxes align with building bases
- [ ] Player collision box visible and correct

### Edge Cases
- [ ] Player can walk between buildings
- [ ] Collision works from all angles
- [ ] No collision at building rooftops (where player can't reach)
- [ ] Buildings don't collide with each other

## Acceptance Criteria
- [ ] Player collides with all 4 buildings
- [ ] Collision boxes appropriately sized
- [ ] Smooth collision response (no bouncing/jittering)
- [ ] Player can navigate around buildings naturally
- [ ] Debug mode shows collision boxes when enabled
- [ ] 60 FPS maintained with collision detection

## Dependencies
- Ticket 04 (Place Buildings) must be complete
- Player class must have physics body (from MVP)

## Estimated Time
30-45 minutes

## Notes
- Static physics bodies are used for buildings (they don't move)
- Collision boxes should be slightly smaller than visual sprites for better feel
- Isometric perspective means collision is 2D despite 3D appearance
- Phaser handles collision response automatically (push player away)
- Fine-tuning collision boxes may require testing and iteration
- Debug mode is essential for visualizing collision boundaries
- Future phases will add interaction zones (press E to enter) within collision boxes
