# Ticket 05: Dynamic Floor Generation

## Objective
Generate library floors dynamically based on Canvas module data. Each module becomes a floor that reflects its status, completion, and content.

## Tasks

### 1. Update FloorManager to Generate Module Floors

Update `src/world/FloorManager.ts`:

```typescript
import { CanvasModule } from '../types/CanvasTypes'
import ModuleStatusHelper from '../utils/ModuleStatusHelper'

export interface Floor {
  floorNumber: number
  floorType: 'lobby' | 'module'
  name: string
  moduleId?: string
  moduleData?: CanvasModule
  status?: string
  accessible?: boolean
}

export default class FloorManager {
  private scene: Phaser.Scene
  private floors: Floor[] = []
  private currentFloorNumber: number = 0

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public initializeFloors(modules?: CanvasModule[]) {
    this.floors = []

    // Floor 0 is always the lobby
    this.floors.push({
      floorNumber: 0,
      floorType: 'lobby',
      name: 'Lobby',
      accessible: true
    })

    // Create a floor for each module
    if (modules && modules.length > 0) {
      // Sort modules by position to ensure correct floor order
      const sortedModules = [...modules].sort((a, b) => a.position - b.position)

      sortedModules.forEach((module, index) => {
        const floorNumber = index + 1 // Lobby is 0, modules start at 1

        this.floors.push({
          floorNumber,
          floorType: 'module',
          name: module.name,
          moduleId: module._id,
          moduleData: module,
          status: ModuleStatusHelper.getStatus(module),
          accessible: ModuleStatusHelper.isAccessible(module)
        })
      })
    }

    console.log(`Initialized ${this.floors.length} floors (1 lobby + ${this.floors.length - 1} modules)`)
  }

  public getCurrentFloor(): Floor {
    return this.floors[this.currentFloorNumber]
  }

  public getFloor(floorNumber: number): Floor | null {
    return this.floors.find(f => f.floorNumber === floorNumber) || null
  }

  public getAllFloors(): Floor[] {
    return this.floors
  }

  public getModuleFloors(): Floor[] {
    return this.floors.filter(f => f.floorType === 'module')
  }

  public getFloorCount(): number {
    return this.floors.length
  }

  public setCurrentFloor(floorNumber: number) {
    const floor = this.getFloor(floorNumber)

    if (floor && floor.accessible) {
      this.currentFloorNumber = floorNumber
      this.scene.events.emit('floor-changed', floor)
      return true
    }

    return false
  }

  public getCurrentFloorNumber(): number {
    return this.currentFloorNumber
  }
}
```

### 2. Create ModuleFloorRenderer

Create `src/world/ModuleFloorRenderer.ts`:

```typescript
import Phaser from 'phaser'
import { Floor } from './FloorManager'
import { CanvasModule } from '../types/CanvasTypes'
import ModuleStatusHelper from '../utils/ModuleStatusHelper'

export default class ModuleFloorRenderer {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public renderFloor(floor: Floor) {
    // Clear previous floor
    this.scene.children.removeAll()

    if (floor.floorType === 'lobby') {
      this.renderLobby()
    } else if (floor.floorType === 'module' && floor.moduleData) {
      this.renderModuleFloor(floor)
    }
  }

  private renderLobby() {
    // This would call the existing lobby creation code
    // We'll keep lobby rendering in the scene for now
  }

  private renderModuleFloor(floor: Floor) {
    const module = floor.moduleData!
    const width = 800
    const height = 600

    // Floor color based on status
    const statusColor = ModuleStatusHelper.getStatusColor(module)
    const floorColor = this.blendColorWithBase(statusColor, 0.2)

    // Base floor
    const floorGraphics = this.scene.add.graphics()
    floorGraphics.fillStyle(floorColor, 1)
    floorGraphics.fillRect(0, 0, width, height)

    // Floor tiles pattern
    floorGraphics.lineStyle(1, 0x000000, 0.1)
    for (let x = 0; x < width; x += 50) {
      for (let y = 0; y < height; y += 50) {
        floorGraphics.strokeRect(x, y, 50, 50)
      }
    }

    // Walls
    this.createWalls()

    // Module header
    this.createModuleHeader(floor)

    // Module statistics
    this.createModuleStats(floor)

    // Module items (placeholder)
    this.createModuleItemsPlaceholder(floor)

    // Elevator (to go back)
    this.createFloorElevator(floor)

    // Progress indicator
    this.createProgressIndicator(floor)
  }

  private createWalls() {
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(0x5a5a5a, 1)

    // Top wall
    graphics.fillRect(0, 0, 800, 50)
    // Left wall
    graphics.fillRect(0, 0, 50, 600)
    // Right wall
    graphics.fillRect(750, 0, 50, 600)
  }

  private createModuleHeader(floor: Floor) {
    const module = floor.moduleData!

    // Module name
    this.scene.add.text(400, 70, module.name, {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // Floor number
    this.scene.add.text(400, 100, `Floor ${floor.floorNumber}`, {
      fontSize: '14px',
      color: '#cccccc'
    }).setOrigin(0.5)

    // Status badge
    const status = ModuleStatusHelper.getStatus(module)
    const statusColor = ModuleStatusHelper.getStatusColor(module)

    const statusBadge = this.scene.add.text(400, 130, status.toUpperCase(), {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: `#${statusColor.toString(16).padStart(6, '0')}`,
      padding: { x: 10, y: 4 }
    }).setOrigin(0.5)
  }

  private createModuleStats(floor: Floor) {
    const module = floor.moduleData!

    const statsX = 100
    const statsY = 180

    const stats = [
      `📚 Total Items: ${module.moduleItemsTotalCount}`,
      `⚠️  Missing Assignments: ${module.submissionStatistics.missingAssignmentCount}`,
      `📅 Due Date: ${ModuleStatusHelper.getDueInfo(module) || 'None'}`,
      `🔓 Prerequisites: ${module.prerequisites.length > 0 ? 'Required' : 'None'}`
    ]

    this.scene.add.text(statsX, statsY, stats, {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 12, y: 8 },
      lineSpacing: 8
    })
  }

  private createModuleItemsPlaceholder(floor: Floor) {
    const module = floor.moduleData!

    // Placeholder for module items (assignments, pages, etc.)
    // This will be implemented in a future phase
    this.scene.add.text(400, 350, [
      `This floor contains ${module.moduleItemsTotalCount} learning items`,
      '',
      'Module items will appear here:',
      '• Assignments',
      '• Pages',
      '• Quizzes',
      '• Discussions',
      '',
      '(Coming in Phase 3)'
    ], {
      fontSize: '13px',
      color: '#999999',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5)
  }

  private createFloorElevator(floor: Floor) {
    const elevatorX = 700
    const elevatorY = 300

    // Elevator
    const elevatorGraphics = this.scene.add.graphics()
    elevatorGraphics.fillStyle(0x4a4a4a, 1)
    elevatorGraphics.fillRect(elevatorX - 40, elevatorY - 60, 80, 120)

    elevatorGraphics.fillStyle(0x708090, 1)
    elevatorGraphics.fillRect(elevatorX - 35, elevatorY - 55, 70, 110)

    // Elevator sign
    this.scene.add.text(elevatorX, elevatorY - 80, 'ELEVATOR', {
      fontSize: '11px',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setOrigin(0.5)

    // Store bounds
    this.scene.registry.set('elevatorBounds', {
      x: elevatorX - 40,
      y: elevatorY - 60,
      width: 80,
      height: 120
    })
  }

  private createProgressIndicator(floor: Floor) {
    const module = floor.moduleData!

    if (!module.progression.completed && module.progression.started) {
      const completion = ModuleStatusHelper.getCompletionPercentage(module)
      const barWidth = 300
      const barHeight = 20

      const x = 400
      const y = 500

      // Progress bar background
      const bgGraphics = this.scene.add.graphics()
      bgGraphics.fillStyle(0x333333, 1)
      bgGraphics.fillRect(x - barWidth/2, y, barWidth, barHeight)

      // Progress bar fill
      const fillGraphics = this.scene.add.graphics()
      fillGraphics.fillStyle(0x00ff00, 1)
      fillGraphics.fillRect(x - barWidth/2, y, barWidth * completion, barHeight)

      // Progress text
      this.scene.add.text(x, y + barHeight + 15, `Progress: ${Math.round(completion * 100)}%`, {
        fontSize: '12px',
        color: '#ffffff'
      }).setOrigin(0.5)
    }
  }

  private blendColorWithBase(color: number, alpha: number): number {
    // Simple color blending with white base for floor tint
    const r = (color >> 16) & 0xff
    const g = (color >> 8) & 0xff
    const b = color & 0xff

    const blendR = Math.floor(r * alpha + 255 * (1 - alpha))
    const blendG = Math.floor(g * alpha + 255 * (1 - alpha))
    const blendB = Math.floor(b * alpha + 255 * (1 - alpha))

    return (blendR << 16) | (blendG << 8) | blendB
  }
}
```

### 3. Update LibraryInteriorScene to Use Dynamic Floors

Update `src/scenes/LibraryInteriorScene.ts`:

```typescript
import MockCanvasService from '../services/MockCanvasService'
import ModuleFloorRenderer from '../world/ModuleFloorRenderer'

export default class LibraryInteriorScene extends Phaser.Scene {
  private floorRenderer!: ModuleFloorRenderer

  // ... existing code ...

  async create() {
    // Load module data
    const modules = await MockCanvasService.fetchModulesAsync(100)

    // Initialize floor manager with module data
    this.floorManager = new FloorManager(this)
    this.floorManager.initializeFloors(modules)

    // Create floor renderer
    this.floorRenderer = new ModuleFloorRenderer(this)

    // Render current floor (lobby)
    this.renderCurrentFloor()

    // ... rest of create code ...

    // Listen for floor changes
    this.events.on('floor-changed', (floor: Floor) => {
      this.renderCurrentFloor()
    })
  }

  private renderCurrentFloor() {
    const floor = this.floorManager.getCurrentFloor()

    if (floor.floorType === 'lobby') {
      this.createLobbyFloor() // Existing lobby code
    } else {
      this.floorRenderer.renderFloor(floor)
    }

    // Recreate player and UI after floor change
    this.respawnPlayer()
    this.createUI()
  }

  private respawnPlayer() {
    if (this.player) {
      this.player.destroy()
    }

    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2
    this.player = new Player(this, centerX, centerY + 100)
  }
}
```

## Testing Checklist

### Floor Initialization
- [ ] Lobby floor (0) is created
- [ ] 5 module floors (1-5) are created from mock data
- [ ] Floors are in correct order (by module position)
- [ ] Each floor has correct name and module data

### Floor Rendering
- [ ] Lobby renders with existing design
- [ ] Module floors render with module-specific content
- [ ] Floor color tints based on module status
- [ ] Module name and floor number display correctly

### Module Status Display
- [ ] Completed module shows green tint
- [ ] In-progress module shows orange tint
- [ ] Locked module shows gray tint
- [ ] Status badge shows correct state

### Module Information
- [ ] Total items count displays
- [ ] Missing assignments count displays
- [ ] Due date information displays
- [ ] Prerequisites info displays

### Progress Indicators
- [ ] In-progress modules show progress bar
- [ ] Progress percentage is accurate
- [ ] Completed modules don't show progress bar
- [ ] Locked modules don't show progress bar

## Acceptance Criteria
- [ ] Library has 1 lobby + N module floors (N = number of modules)
- [ ] Each module floor displays relevant module information
- [ ] Visual indicators reflect module status
- [ ] Floors are accessible based on module lock status
- [ ] Floor rendering is dynamic and data-driven

## Dependencies
- Ticket 03 complete (static lobby)
- Ticket 04 complete (mock data)
- FloorManager class exists

## Estimated Time
2-2.5 hours

## Notes
- Module floors should visually reflect their status
- Keep layouts consistent for easy navigation
- Placeholder for module items (Phase 3 will add interactions)
- Floor clearing and re-rendering should be smooth
- Consider transition animations in future enhancements
