# Ticket 03: Static Lobby Floor

## Objective
Build a detailed, permanent lobby floor for the library that serves as the entry point and navigation hub. This floor is always present regardless of Canvas modules.

## Tasks

### 1. Create Floor Manager

Create `src/world/FloorManager.ts`:

```typescript
import Phaser from 'phaser'

export interface Floor {
  floorNumber: number
  floorType: 'lobby' | 'module'
  name: string
  moduleId?: string
  moduleData?: any
}

export default class FloorManager {
  private scene: Phaser.Scene
  private floors: Floor[] = []
  private currentFloor: number = 0

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public initializeFloors(moduleData?: any[]) {
    this.floors = []

    // Floor 0 is always the lobby
    this.floors.push({
      floorNumber: 0,
      floorType: 'lobby',
      name: 'Lobby'
    })

    // Add module floors (will implement in later ticket)
    // For now, just lobby
  }

  public getCurrentFloor(): Floor {
    return this.floors[this.currentFloor]
  }

  public getAllFloors(): Floor[] {
    return this.floors
  }

  public getFloorCount(): number {
    return this.floors.length
  }

  public setCurrentFloor(floorNumber: number) {
    if (floorNumber >= 0 && floorNumber < this.floors.length) {
      this.currentFloor = floorNumber
    }
  }
}
```

### 2. Create Lobby Floor Layout

Update `src/scenes/LibraryInteriorScene.ts`:

```typescript
export default class LibraryInteriorScene extends Phaser.Scene {
  private floorManager!: FloorManager

  // ... existing code ...

  create() {
    // Initialize floor manager
    this.floorManager = new FloorManager(this)
    this.floorManager.initializeFloors()

    // Create lobby floor
    this.createLobbyFloor()

    // ... rest of existing create code ...
  }

  private createLobbyFloor() {
    const width = 800
    const height = 600

    // Floor
    const floorGraphics = this.add.graphics()

    // Marble floor pattern
    floorGraphics.fillStyle(0xe8e8e8, 1)
    floorGraphics.fillRect(0, 0, width, height)

    // Marble tiles
    floorGraphics.lineStyle(2, 0xcccccc, 0.5)
    for (let x = 0; x < width; x += 64) {
      floorGraphics.lineBetween(x, 0, x, height)
    }
    for (let y = 0; y < height; y += 64) {
      floorGraphics.lineBetween(0, y, width, y)
    }

    // Walls
    this.createWalls()

    // Reception desk
    this.createReceptionDesk()

    // Elevator
    this.createElevator()

    // Exit door
    this.createExitDoor()

    // Decorative elements
    this.createDecorations()

    // Information signs
    this.createSigns()
  }

  private createWalls() {
    const graphics = this.add.graphics()

    // Wall color (warm beige)
    graphics.fillStyle(0xd4a373, 1)

    // Top wall
    graphics.fillRect(0, 0, 800, 60)

    // Left wall
    graphics.fillRect(0, 0, 60, 600)

    // Right wall
    graphics.fillRect(740, 0, 60, 600)

    // Wall trim/molding
    graphics.lineStyle(3, 0x8b6f47, 1)
    graphics.strokeRect(60, 60, 680, 480)
  }

  private createReceptionDesk() {
    const centerX = 400

    // Desk base
    const deskGraphics = this.add.graphics()
    deskGraphics.fillStyle(0x8b4513, 1)
    deskGraphics.fillRect(centerX - 100, 150, 200, 80)

    // Desk top
    deskGraphics.fillStyle(0xa0522d, 1)
    deskGraphics.fillRect(centerX - 105, 145, 210, 10)

    // Desk label
    this.add.text(centerX, 190, 'INFORMATION', {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // Welcome sign
    this.add.text(centerX, 100, 'Welcome to University Library', {
      fontSize: '20px',
      color: '#8b4513',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    this.add.text(centerX, 125, 'Course Modules & Learning Materials', {
      fontSize: '14px',
      color: '#666666'
    }).setOrigin(0.5)
  }

  private createElevator() {
    const elevatorX = 700
    const elevatorY = 300

    // Elevator shaft
    const elevatorGraphics = this.add.graphics()
    elevatorGraphics.fillStyle(0x4a4a4a, 1)
    elevatorGraphics.fillRect(elevatorX - 50, elevatorY - 80, 100, 160)

    // Elevator doors
    elevatorGraphics.fillStyle(0x708090, 1)
    elevatorGraphics.fillRect(elevatorX - 45, elevatorY - 70, 90, 140)

    // Door split
    elevatorGraphics.lineStyle(3, 0x2f4f4f, 1)
    elevatorGraphics.lineBetween(elevatorX, elevatorY - 70, elevatorX, elevatorY + 70)

    // Elevator call button
    elevatorGraphics.fillStyle(0xffff00, 1)
    elevatorGraphics.fillCircle(elevatorX - 60, elevatorY, 8)

    // Elevator sign
    this.add.text(elevatorX, elevatorY - 110, 'ELEVATOR', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5)

    this.add.text(elevatorX, elevatorY - 95, '↑ Module Floors', {
      fontSize: '10px',
      color: '#666666'
    }).setOrigin(0.5)

    // Store elevator bounds for interaction
    this.registry.set('elevatorBounds', {
      x: elevatorX - 50,
      y: elevatorY - 80,
      width: 100,
      height: 160
    })
  }

  private createExitDoor() {
    const doorX = 400
    const doorY = 570

    // Door frame
    const doorGraphics = this.add.graphics()
    doorGraphics.fillStyle(0x8b4513, 1)
    doorGraphics.fillRect(doorX - 50, doorY, 100, 30)

    // Door panels
    doorGraphics.fillStyle(0xa0522d, 1)
    doorGraphics.fillRect(doorX - 45, doorY + 5, 40, 20)
    doorGraphics.fillRect(doorX + 5, doorY + 5, 40, 20)

    // Door handles
    doorGraphics.fillStyle(0xffd700, 1)
    doorGraphics.fillCircle(doorX - 25, doorY + 15, 3)
    doorGraphics.fillCircle(doorX + 25, doorY + 15, 3)

    // EXIT sign above door
    this.add.text(doorX, doorY - 20, 'EXIT', {
      fontSize: '16px',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 },
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // Store exit bounds
    this.registry.set('exitBounds', {
      x: doorX - 50,
      y: doorY - 50,
      width: 100,
      height: 80
    })
  }

  private createDecorations() {
    // Potted plants
    const plantPositions = [
      { x: 100, y: 200 },
      { x: 100, y: 400 },
      { x: 700, y: 500 }
    ]

    plantPositions.forEach(pos => {
      const graphics = this.add.graphics()

      // Pot
      graphics.fillStyle(0x8b4513, 1)
      graphics.fillRect(pos.x - 15, pos.y, 30, 40)

      // Plant (simple circles for leaves)
      graphics.fillStyle(0x228b22, 1)
      graphics.fillCircle(pos.x - 10, pos.y - 10, 12)
      graphics.fillCircle(pos.x + 10, pos.y - 10, 12)
      graphics.fillCircle(pos.x, pos.y - 20, 12)
    })

    // Benches
    const benchPositions = [
      { x: 150, y: 300 },
      { x: 650, y: 150 }
    ]

    benchPositions.forEach(pos => {
      const graphics = this.add.graphics()

      // Bench seat
      graphics.fillStyle(0x8b4513, 1)
      graphics.fillRect(pos.x, pos.y, 80, 15)

      // Bench legs
      graphics.fillRect(pos.x + 5, pos.y + 15, 8, 20)
      graphics.fillRect(pos.x + 67, pos.y + 15, 8, 20)

      // Bench back
      graphics.fillRect(pos.x, pos.y - 30, 80, 10)
      graphics.fillRect(pos.x + 5, pos.y - 30, 8, 35)
      graphics.fillRect(pos.x + 67, pos.y - 30, 8, 35)
    })
  }

  private createSigns() {
    // Directory sign
    this.add.text(150, 150, [
      '📚 Library Directory',
      '',
      'Ground Floor: Lobby',
      'Upper Floors: Course Modules',
      '',
      'Use elevator to access',
      'module floors'
    ], {
      fontSize: '12px',
      color: '#000000',
      backgroundColor: '#ffffffdd',
      padding: { x: 10, y: 8 },
      lineSpacing: 4
    })

    // Floor indicator
    const floorIndicator = this.add.text(750, 200, [
      'Current Floor:',
      'LOBBY',
      '(Ground Floor)'
    ], {
      fontSize: '11px',
      color: '#ffffff',
      backgroundColor: '#000000dd',
      padding: { x: 8, y: 6 },
      align: 'center'
    }).setOrigin(1, 0)

    floorIndicator.setScrollFactor(0)
    floorIndicator.setDepth(100)
  }
}
```

### 3. Update Interaction for Elevator

Add elevator interaction check:

```typescript
// In LibraryInteriorScene update method or postupdate event
private checkElevatorInteraction() {
  const playerPos = this.player.getPosition()
  const elevatorBounds = this.registry.get('elevatorBounds')

  if (elevatorBounds) {
    const inElevatorZone = Phaser.Geom.Rectangle.Contains(
      new Phaser.Geom.Rectangle(
        elevatorBounds.x,
        elevatorBounds.y,
        elevatorBounds.width,
        elevatorBounds.height
      ),
      playerPos.x,
      playerPos.y
    )

    if (inElevatorZone) {
      // Show elevator prompt (will implement full elevator UI in next ticket)
      console.log('Near elevator - press E to use (not yet implemented)')
    }
  }
}
```

## Testing Checklist

### Visual Layout
- [ ] Marble-patterned floor is visible
- [ ] Warm-colored walls frame the lobby
- [ ] Reception desk is centered and prominent
- [ ] Elevator is clearly visible on right side
- [ ] Exit door is at bottom center
- [ ] Decorations (plants, benches) add life to space

### Text and Signs
- [ ] Welcome message is clear and centered
- [ ] Directory sign explains floor layout
- [ ] EXIT sign is bright green and visible
- [ ] Floor indicator shows "LOBBY"
- [ ] All text is readable

### Layout Quality
- [ ] Space feels like a real library lobby
- [ ] Nothing blocks player movement unnecessarily
- [ ] Elevator and exit are easily accessible
- [ ] Reception desk is decorative, not blocking

### Functionality
- [ ] Player can walk around entire lobby
- [ ] No collision issues with decorations
- [ ] Console logs when near elevator
- [ ] Exit prompt appears when near door

## Acceptance Criteria
- [ ] Lobby floor has professional, library-like appearance
- [ ] All elements (desk, elevator, exit) are clearly identifiable
- [ ] Player can navigate lobby freely
- [ ] Elevator location is stored for future interaction
- [ ] Exit door is functional
- [ ] Decorative elements enhance atmosphere

## Dependencies
- Ticket 02 complete (scene transition)
- FloorManager class created

## Estimated Time
1.5-2 hours

## Notes
- Lobby should feel welcoming and orient player to library
- Simple graphics are fine - focus on clear layout
- Elevator doesn't need to be functional yet (next ticket)
- Keep decorations simple but add character
- Floor numbering: 0 = Lobby, 1+ = Module floors
- Future enhancement: add NPC librarian, more detailed art
