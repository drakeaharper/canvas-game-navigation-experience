# Ticket 01: Interaction System

## Objective
Implement a proximity-based interaction system that detects when the player is near a building entrance and allows them to press 'E' to interact.

## Tasks

### 1. Create InteractionManager Class

Create `src/utils/InteractionManager.ts`:

```typescript
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Building from '../sprites/Building'

export interface InteractionTarget {
  type: 'building'
  object: Building
  action: 'enter'
}

export default class InteractionManager {
  private scene: Phaser.Scene
  private player: Player
  private interactionKey!: Phaser.Input.Keyboard.Key
  private currentTarget: InteractionTarget | null = null
  private promptText!: Phaser.GameObjects.Text

  private readonly INTERACTION_DISTANCE = 80 // pixels

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene
    this.player = player

    // Setup E key for interactions
    this.interactionKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    )

    // Create interaction prompt (hidden by default)
    this.createPrompt()
  }

  private createPrompt() {
    const centerX = this.scene.cameras.main.width / 2

    this.promptText = this.scene.add.text(
      centerX,
      100,
      '',
      {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000dd',
        padding: { x: 12, y: 8 },
        align: 'center'
      }
    )
    this.promptText.setOrigin(0.5, 0)
    this.promptText.setScrollFactor(0)
    this.promptText.setDepth(1000)
    this.promptText.setVisible(false)
  }

  public update() {
    // Check for nearby interaction targets
    const target = this.findNearestInteractionTarget()

    if (target) {
      this.showPrompt(target)
      this.currentTarget = target

      // Check if player pressed E
      if (Phaser.Input.Keyboard.JustDown(this.interactionKey)) {
        this.interact(target)
      }
    } else {
      this.hidePrompt()
      this.currentTarget = null
    }
  }

  private findNearestInteractionTarget(): InteractionTarget | null {
    // Get buildings from scene (we'll need to pass these in)
    const gameScene = this.scene as any
    if (!gameScene.buildingManager) return null

    const buildings = gameScene.buildingManager.getAllBuildings()
    const playerPos = this.player.getPosition()

    let nearestBuilding: Building | null = null
    let minDistance = Infinity

    buildings.forEach((building: Building) => {
      const dx = building.x - playerPos.x
      const dy = building.y - playerPos.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < this.INTERACTION_DISTANCE && distance < minDistance) {
        minDistance = distance
        nearestBuilding = building
      }
    })

    if (nearestBuilding) {
      return {
        type: 'building',
        object: nearestBuilding,
        action: 'enter'
      }
    }

    return null
  }

  private showPrompt(target: InteractionTarget) {
    const buildingName = target.object.getBuildingName()
    this.promptText.setText(`Press [E] to enter ${buildingName}`)
    this.promptText.setVisible(true)
  }

  private hidePrompt() {
    this.promptText.setVisible(false)
  }

  private interact(target: InteractionTarget) {
    if (target.type === 'building' && target.action === 'enter') {
      this.enterBuilding(target.object)
    }
  }

  private enterBuilding(building: Building) {
    const buildingType = building.getBuildingType()
    console.log(`Entering building: ${building.getBuildingName()}`)

    // Emit event that GameScene can listen to
    this.scene.events.emit('enter-building', {
      buildingType,
      building
    })
  }

  public destroy() {
    this.promptText.destroy()
  }
}
```

### 2. Update GameScene to Use InteractionManager

Update `src/scenes/GameScene.ts`:

```typescript
import InteractionManager from '../utils/InteractionManager'

export default class GameScene extends Phaser.Scene {
  // ... existing properties
  private interactionManager!: InteractionManager

  create() {
    // ... existing setup ...

    // Create interaction manager (after player is created)
    this.interactionManager = new InteractionManager(this, this.player)

    // Listen for building entry events
    this.events.on('enter-building', this.handleEnterBuilding, this)
  }

  update(time: number, delta: number) {
    // ... existing player movement code ...

    // Update interaction system
    this.interactionManager.update()
  }

  private handleEnterBuilding(data: { buildingType: string, building: any }) {
    console.log('Entering building:', data.buildingType)

    // For now, just log
    // In next ticket, we'll handle scene transitions
  }
}
```

### 3. Add Visual Feedback on Buildings

Update `src/sprites/Building.ts` to add highlighting when player is nearby:

```typescript
export default class Building extends Phaser.Physics.Arcade.Image {
  // ... existing code ...

  public setHighlighted(highlighted: boolean) {
    if (highlighted) {
      this.setTint(0xffff88) // Slight yellow tint
    } else {
      this.clearTint()
    }
  }
}
```

Update `InteractionManager` to highlight buildings:

```typescript
private findNearestInteractionTarget(): InteractionTarget | null {
  // ... existing code to find nearest building ...

  // Clear previous highlights
  buildings.forEach((building: Building) => {
    building.setHighlighted(false)
  })

  if (nearestBuilding) {
    nearestBuilding.setHighlighted(true)
    return {
      type: 'building',
      object: nearestBuilding,
      action: 'enter'
    }
  }

  return null
}
```

## Testing Checklist

### Proximity Detection
- [ ] Walk near library building - prompt appears when within 80px
- [ ] Walk away from library - prompt disappears
- [ ] Prompt shows correct building name
- [ ] Prompt is centered at top of screen

### Interaction
- [ ] Press 'E' near library - console logs "Entering building: University Library"
- [ ] Press 'E' away from library - nothing happens
- [ ] Press 'E' near other buildings - logs correct building name

### Visual Feedback
- [ ] Building highlights (yellow tint) when player is nearby
- [ ] Highlight removes when player walks away
- [ ] Only one building highlighted at a time

### Edge Cases
- [ ] Standing between two buildings - nearest one is highlighted
- [ ] Prompt updates when switching between buildings
- [ ] Interaction works from all angles around building

## Acceptance Criteria
- [ ] Interaction prompt appears when near any building
- [ ] Player can press 'E' to interact with building
- [ ] Event is emitted with building type and object
- [ ] Visual highlight on interactive buildings
- [ ] Prompt is UI element (doesn't scroll with camera)

## Dependencies
- Phase 1 complete (buildings exist in world)
- Building class has `getBuildingName()` and `getBuildingType()` methods

## Estimated Time
45-60 minutes

## Notes
- Interaction distance (80px) may need tweaking based on building sizes
- Currently only handles building entry, can extend for other interactions
- E key is standard in many games for "use/interact"
- Highlight tint is subtle to avoid being distracting
- Event system allows loose coupling between interaction and scene transitions
