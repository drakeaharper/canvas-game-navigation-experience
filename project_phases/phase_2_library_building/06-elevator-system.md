# Ticket 06: Elevator System

## Objective
Implement an interactive elevator that allows players to navigate between floors (lobby and module floors) with a UI floor selector.

## Tasks

### 1. Create ElevatorUI Component

Create `src/ui/ElevatorUI.ts`:

```typescript
import Phaser from 'phaser'
import { Floor } from '../world/FloorManager'

export default class ElevatorUI {
  private scene: Phaser.Scene
  private container!: Phaser.GameObjects.Container
  private isVisible: boolean = false
  private selectedFloorIndex: number = 0
  private floors: Floor[] = []
  private currentFloor: number = 0

  private readonly PANEL_WIDTH = 400
  private readonly PANEL_HEIGHT = 500
  private readonly FLOOR_BUTTON_HEIGHT = 50

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createUI()
  }

  private createUI() {
    const centerX = this.scene.cameras.main.width / 2
    const centerY = this.scene.cameras.main.height / 2

    this.container = this.scene.add.container(centerX, centerY)
    this.container.setDepth(2000)
    this.container.setScrollFactor(0)
    this.container.setVisible(false)

    // Semi-transparent background overlay
    const overlay = this.scene.add.rectangle(
      0,
      0,
      this.scene.cameras.main.width,
      this.scene.cameras.main.height,
      0x000000,
      0.7
    )
    overlay.setOrigin(0.5)
    this.container.add(overlay)

    // Panel background
    const panel = this.scene.add.rectangle(0, 0, this.PANEL_WIDTH, this.PANEL_HEIGHT, 0x2a2a2a)
    panel.setStrokeStyle(3, 0xffaa00)
    this.container.add(panel)

    // Title
    const title = this.scene.add.text(0, -this.PANEL_HEIGHT/2 + 30, 'FLOOR SELECTOR', {
      fontSize: '20px',
      color: '#ffaa00',
      fontStyle: 'bold'
    })
    title.setOrigin(0.5)
    this.container.add(title)

    // Instructions
    const instructions = this.scene.add.text(0, -this.PANEL_HEIGHT/2 + 60, 'Use ↑↓ arrows to select • ENTER to go • ESC to cancel', {
      fontSize: '12px',
      color: '#999999'
    })
    instructions.setOrigin(0.5)
    this.container.add(instructions)
  }

  public show(floors: Floor[], currentFloor: number) {
    this.floors = floors
    this.currentFloor = currentFloor
    this.selectedFloorIndex = currentFloor
    this.isVisible = true

    this.container.setVisible(true)
    this.renderFloorList()

    // Setup keyboard controls
    this.setupControls()
  }

  public hide() {
    this.isVisible = false
    this.container.setVisible(false)
    this.removeControls()
  }

  private renderFloorList() {
    // Remove existing floor buttons (keep overlay, panel, title, instructions)
    const childrenToKeep = 4
    while (this.container.length > childrenToKeep) {
      const child = this.container.getAt(childrenToKeep)
      child.destroy()
    }

    const startY = -this.PANEL_HEIGHT/2 + 100
    const buttonSpacing = this.FLOOR_BUTTON_HEIGHT + 5

    this.floors.forEach((floor, index) => {
      const y = startY + (index * buttonSpacing)

      // Button background
      const isSelected = index === this.selectedFloorIndex
      const isCurrent = floor.floorNumber === this.currentFloor
      const isAccessible = floor.accessible !== false

      let buttonColor = 0x444444
      if (isSelected) buttonColor = 0xffaa00
      else if (isCurrent) buttonColor = 0x00aa00
      else if (!isAccessible) buttonColor = 0x222222

      const button = this.scene.add.rectangle(
        0,
        y,
        this.PANEL_WIDTH - 40,
        this.FLOOR_BUTTON_HEIGHT,
        buttonColor
      )
      button.setStrokeStyle(2, isSelected ? 0xffffff : 0x666666)
      this.container.add(button)

      // Floor info
      const floorLabel = floor.floorType === 'lobby'
        ? `Ground Floor - ${floor.name}`
        : `Floor ${floor.floorNumber} - ${floor.name}`

      const labelColor = isAccessible ? '#ffffff' : '#666666'
      const label = this.scene.add.text(0, y - 8, floorLabel, {
        fontSize: '14px',
        color: labelColor,
        fontStyle: isSelected ? 'bold' : 'normal'
      })
      label.setOrigin(0.5)
      this.container.add(label)

      // Status indicator
      if (floor.floorType === 'module' && floor.status) {
        const statusText = this.scene.add.text(0, y + 10, floor.status, {
          fontSize: '10px',
          color: '#aaaaaa'
        })
        statusText.setOrigin(0.5)
        this.container.add(statusText)
      }

      // Current floor indicator
      if (isCurrent) {
        const currentIndicator = this.scene.add.text(-this.PANEL_WIDTH/2 + 30, y, '●', {
          fontSize: '12px',
          color: '#00ff00'
        })
        currentIndicator.setOrigin(0.5)
        this.container.add(currentIndicator)
      }

      // Locked indicator
      if (!isAccessible) {
        const lockIcon = this.scene.add.text(this.PANEL_WIDTH/2 - 30, y, '🔒', {
          fontSize: '16px'
        })
        lockIcon.setOrigin(0.5)
        this.container.add(lockIcon)
      }
    })
  }

  private setupControls() {
    const keyboard = this.scene.input.keyboard!

    // Arrow up
    keyboard.on('keydown-UP', this.selectPreviousFloor, this)

    // Arrow down
    keyboard.on('keydown-DOWN', this.selectNextFloor, this)

    // Enter key
    keyboard.on('keydown-ENTER', this.confirmSelection, this)

    // Escape key
    keyboard.on('keydown-ESC', this.cancel, this)
  }

  private removeControls() {
    const keyboard = this.scene.input.keyboard!

    keyboard.off('keydown-UP', this.selectPreviousFloor, this)
    keyboard.off('keydown-DOWN', this.selectNextFloor, this)
    keyboard.off('keydown-ENTER', this.confirmSelection, this)
    keyboard.off('keydown-ESC', this.cancel, this)
  }

  private selectPreviousFloor() {
    if (this.selectedFloorIndex > 0) {
      this.selectedFloorIndex--
      this.renderFloorList()
    }
  }

  private selectNextFloor() {
    if (this.selectedFloorIndex < this.floors.length - 1) {
      this.selectedFloorIndex++
      this.renderFloorList()
    }
  }

  private confirmSelection() {
    const selectedFloor = this.floors[this.selectedFloorIndex]

    // Check if floor is accessible
    if (selectedFloor.accessible === false) {
      // Show error message
      this.showLockedMessage()
      return
    }

    // Emit event to change floor
    this.scene.events.emit('elevator-floor-selected', selectedFloor.floorNumber)
    this.hide()
  }

  private showLockedMessage() {
    const errorText = this.scene.add.text(0, this.PANEL_HEIGHT/2 - 30, 'This floor is locked!', {
      fontSize: '14px',
      color: '#ff0000',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    })
    errorText.setOrigin(0.5)
    this.container.add(errorText)

    // Remove after 2 seconds
    this.scene.time.delayedCall(2000, () => {
      errorText.destroy()
    })
  }

  private cancel() {
    this.hide()
  }

  public destroy() {
    this.hide()
    this.container.destroy()
  }
}
```

### 2. Update LibraryInteriorScene with Elevator Interaction

Update `src/scenes/LibraryInteriorScene.ts`:

```typescript
import ElevatorUI from '../ui/ElevatorUI'

export default class LibraryInteriorScene extends Phaser.Scene {
  private elevatorUI!: ElevatorUI
  private isElevatorUIOpen: boolean = false

  create() {
    // ... existing code ...

    // Create elevator UI
    this.elevatorUI = new ElevatorUI(this)

    // Listen for elevator interaction
    this.events.on('elevator-floor-selected', this.changeFloor, this)

    // Check for elevator interaction in update
  }

  update(time: number, delta: number) {
    if (!this.isElevatorUIOpen) {
      const directionVector = this.inputManager.getDirectionVector()
      const direction8Way = this.inputManager.getDirection8Way()

      this.player.move(directionVector, direction8Way)

      // Check elevator interaction
      this.checkElevatorInteraction()
    }

    // Check exit interaction
    this.checkExitInteraction()
  }

  private checkElevatorInteraction() {
    const playerPos = this.player.getPosition()
    const elevatorBounds = this.registry.get('elevatorBounds')

    if (!elevatorBounds) return

    const inElevatorZone = Phaser.Geom.Rectangle.Contains(
      new Phaser.Geom.Rectangle(
        elevatorBounds.x,
        elevatorBounds.y,
        elevatorBounds.width,
        elevatorBounds.height + 50 // Extended interaction zone
      ),
      playerPos.x,
      playerPos.y
    )

    if (inElevatorZone) {
      // Show prompt
      if (!this.elevatorPrompt) {
        this.elevatorPrompt = this.add.text(
          400,
          100,
          'Press [E] to use elevator',
          {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#000000dd',
            padding: { x: 8, y: 4 }
          }
        )
        this.elevatorPrompt.setOrigin(0.5)
        this.elevatorPrompt.setScrollFactor(0)
        this.elevatorPrompt.setDepth(100)
      }

      // Check E key
      if (Phaser.Input.Keyboard.JustDown(this.exitKey)) {
        this.openElevatorUI()
      }
    } else {
      if (this.elevatorPrompt) {
        this.elevatorPrompt.destroy()
        this.elevatorPrompt = null
      }
    }
  }

  private openElevatorUI() {
    this.isElevatorUIOpen = true

    const floors = this.floorManager.getAllFloors()
    const currentFloor = this.floorManager.getCurrentFloorNumber()

    this.elevatorUI.show(floors, currentFloor)
  }

  private changeFloor(floorNumber: number) {
    const success = this.floorManager.setCurrentFloor(floorNumber)

    if (success) {
      // Floor changed event will trigger floor re-render
      console.log(`Changed to floor ${floorNumber}`)
    }

    this.isElevatorUIOpen = false
  }

  private checkExitInteraction() {
    // Only allow exit from lobby (floor 0)
    if (this.floorManager.getCurrentFloorNumber() !== 0) {
      return
    }

    // ... existing exit check code ...
  }
}
```

### 3. Add Floor Change Transition Effect

Add transition to `src/effects/SceneTransition.ts`:

```typescript
export default class SceneTransition {
  // ... existing methods ...

  static floorTransition(
    scene: Phaser.Scene,
    direction: 'up' | 'down',
    duration: number = 400,
    callback: () => void
  ) {
    const camera = scene.cameras.main

    // Slide effect
    const startY = 0
    const endY = direction === 'up' ? -camera.height : camera.height

    scene.tweens.add({
      targets: camera,
      scrollY: endY,
      duration: duration / 2,
      ease: 'Power2',
      onComplete: () => {
        callback()

        // Reset and slide back in
        camera.scrollY = -endY
        scene.tweens.add({
          targets: camera,
          scrollY: 0,
          duration: duration / 2,
          ease: 'Power2'
        })
      }
    })
  }
}
```

Update floor change to use transition:

```typescript
private changeFloor(floorNumber: number) {
  const currentFloor = this.floorManager.getCurrentFloorNumber()
  const direction = floorNumber > currentFloor ? 'up' : 'down'

  SceneTransition.floorTransition(this, direction, 400, () => {
    const success = this.floorManager.setCurrentFloor(floorNumber)
    // Floor will re-render via event
  })

  this.isElevatorUIOpen = false
}
```

## Testing Checklist

### Elevator UI
- [ ] Elevator UI opens when pressing E near elevator
- [ ] All floors are listed in correct order
- [ ] Current floor is highlighted in green
- [ ] Selected floor is highlighted in orange
- [ ] Locked floors show lock icon and can't be selected

### Keyboard Controls
- [ ] Up arrow selects previous floor
- [ ] Down arrow selects next floor
- [ ] Enter key confirms selection and changes floor
- [ ] ESC key closes elevator without changing floor
- [ ] Can't select floors above/below list bounds

### Floor Navigation
- [ ] Selecting lobby takes player to lobby
- [ ] Selecting module floor takes player to that floor
- [ ] Floor content changes correctly
- [ ] Player respawns in center of new floor
- [ ] Elevator is present on all floors

### Accessibility
- [ ] Can navigate to unlocked floors
- [ ] Cannot navigate to locked floors
- [ ] Error message shows when trying locked floor
- [ ] Completed floors are accessible
- [ ] In-progress floors are accessible

### Visual Feedback
- [ ] Floor transition animation plays
- [ ] UI updates smoothly
- [ ] Floor selector shows status of each floor
- [ ] Current floor indicator (●) is visible

## Acceptance Criteria
- [ ] Player can open elevator UI from any floor
- [ ] Player can navigate to any accessible floor
- [ ] Locked floors cannot be accessed
- [ ] Floor changes are smooth with transition
- [ ] UI is intuitive and easy to use
- [ ] Exit is only available from lobby

## Dependencies
- Ticket 03 complete (lobby floor)
- Ticket 05 complete (dynamic floors)
- FloorManager handles floor changing

## Estimated Time
2-2.5 hours

## Notes
- Elevator should be accessible from all floors for navigation
- Only lobby has exit door (can't exit from module floors)
- Future enhancement: elevator "ding" sound effect
- Future enhancement: animated elevator doors
- Locked floor message helps guide players to unlock prerequisites
- Keyboard controls are more reliable than mouse for floor selection
