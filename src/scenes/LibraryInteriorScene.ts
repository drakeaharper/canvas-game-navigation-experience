import Phaser from 'phaser'
import Player from '../sprites/Player'
import InputManager from '../utils/InputManager'
import FloorManager from '../world/FloorManager'
import ModuleFloorRenderer from '../world/ModuleFloorRenderer'
import ElevatorUI from '../ui/ElevatorUI'
import { CanvasModule } from '../types/CanvasTypes'
import MockCanvasService from '../services/MockCanvasService'

export interface LibrarySceneData {
  playerData: {
    previousX: number
    previousY: number
  }
  moduleData?: CanvasModule[]
}

export default class LibraryInteriorScene extends Phaser.Scene {
  private player!: Player
  private inputManager!: InputManager
  private exitKey!: Phaser.Input.Keyboard.Key
  private elevatorKey!: Phaser.Input.Keyboard.Key
  private previousPlayerPosition!: { x: number, y: number }
  private exitPrompt!: Phaser.GameObjects.Text | null
  private elevatorPrompt!: Phaser.GameObjects.Text | null
  private floorManager!: FloorManager
  private moduleFloorRenderer!: ModuleFloorRenderer
  private elevatorUI!: ElevatorUI
  private currentFloorGraphics: Phaser.GameObjects.GameObject[] = []

  constructor() {
    super({ key: 'LibraryInteriorScene' })
  }

  init(data: LibrarySceneData) {
    // Store where the player was in the outdoor scene
    this.previousPlayerPosition = {
      x: data.playerData.previousX,
      y: data.playerData.previousY
    }
  }

  async create() {
    // Fetch mock Canvas module data
    // TODO: Replace with real Canvas API in future phase
    const mockResponse = await MockCanvasService.getCourseModules('mock-course-id')
    const modules = mockResponse.course.modulesConnection.nodes

    // Initialize floor manager with module data
    this.floorManager = new FloorManager(this)
    this.floorManager.initializeFloors(modules)

    // Initialize module floor renderer
    this.moduleFloorRenderer = new ModuleFloorRenderer(this)

    // Initialize elevator UI
    this.elevatorUI = new ElevatorUI(
      this,
      this.floorManager.getAllFloors(),
      this.floorManager.getCurrentFloorNumber()
    )

    // Render initial floor (lobby)
    this.renderCurrentFloor()

    // Create player in library
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2
    this.player = new Player(this, centerX, centerY + 100)

    // Input setup
    this.inputManager = new InputManager(this)

    // Exit key (E) - will be used for both exit and elevator
    this.exitKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.elevatorKey = this.exitKey // Same key for both interactions

    // Camera setup
    this.cameras.main.setBounds(0, 0, 800, 600)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    // Fade in
    this.cameras.main.fadeIn(300, 0, 0, 0)

    // UI
    this.createUI()
  }

  private createLobbyFloor() {
    const width = 800
    const height = 600

    // Marble floor
    const floorGraphics = this.add.graphics()
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

    // Decorations
    this.createDecorations()

    // Signs
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

  private createUI() {
    const infoText = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000dd',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(100)

    this.events.on('postupdate', () => {
      const pos = this.player.getPosition()
      const velocity = this.player.getVelocity()
      const speed = velocity.length().toFixed(0)
      const currentFloor = this.floorManager.getCurrentFloor()

      infoText.setText([
        `University Library - ${currentFloor.name}`,
        'Use Arrow Keys or WASD to move',
        `Position: (${Math.round(pos.x)}, ${Math.round(pos.y)})`,
        `Speed: ${speed} px/s`,
        currentFloor.floorType === 'lobby' ? 'Walk to EXIT to leave' : 'Use ELEVATOR to change floors'
      ])

      // Check for interactions (only if elevator UI is not open)
      if (!this.elevatorUI.isOpen()) {
        this.checkExitInteraction()
        this.checkElevatorInteraction()
      }
    })
  }

  /**
   * Render the current floor (lobby or module floor)
   */
  private renderCurrentFloor() {
    // Clear previous floor graphics
    this.clearCurrentFloor()

    const currentFloor = this.floorManager.getCurrentFloor()

    if (currentFloor.floorType === 'lobby') {
      this.createLobbyFloor()
    } else {
      // Render module floor
      this.moduleFloorRenderer.renderFloor(currentFloor)
    }
  }

  /**
   * Clear all graphics from current floor
   */
  private clearCurrentFloor() {
    this.currentFloorGraphics.forEach(obj => obj.destroy())
    this.currentFloorGraphics = []
  }

  /**
   * Switch to a different floor
   * Called by elevator system
   */
  public switchToFloor(floorNumber: number) {
    // Fade out
    this.cameras.main.fadeOut(200, 0, 0, 0)

    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Change floor
      this.floorManager.setCurrentFloor(floorNumber)
      this.renderCurrentFloor()

      // Update elevator UI
      this.elevatorUI.updateCurrentFloor(floorNumber)

      // Reposition player at elevator
      this.player.setPosition(650, 300)

      // Fade in
      this.cameras.main.fadeIn(200, 0, 0, 0)
    })
  }

  private checkElevatorInteraction() {
    const elevatorBounds = this.registry.get('elevatorBounds')
    if (!elevatorBounds) return

    const playerX = this.player.x
    const playerY = this.player.y

    // Check if player is near elevator
    const nearElevator =
      playerX >= elevatorBounds.x - 50 &&
      playerX <= elevatorBounds.x + elevatorBounds.width + 50 &&
      playerY >= elevatorBounds.y - 50 &&
      playerY <= elevatorBounds.y + elevatorBounds.height + 50

    if (nearElevator) {
      if (!this.elevatorPrompt) {
        this.elevatorPrompt = this.add.text(
          650,
          400,
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

      // Check for E key press
      if (Phaser.Input.Keyboard.JustDown(this.elevatorKey)) {
        this.openElevator()
      }
    } else {
      if (this.elevatorPrompt) {
        this.elevatorPrompt.destroy()
        this.elevatorPrompt = null
      }
    }
  }

  private openElevator() {
    // Show elevator UI
    this.elevatorUI.show((floorNumber: number) => {
      this.switchToFloor(floorNumber)
    })
  }

  private checkExitInteraction() {
    const playerY = this.player.y

    if (playerY > 500) {
      if (!this.exitPrompt) {
        this.exitPrompt = this.add.text(
          400,
          520,
          'Press [E] to exit library',
          {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#000000dd',
            padding: { x: 8, y: 4 }
          }
        )
        this.exitPrompt.setOrigin(0.5)
        this.exitPrompt.setScrollFactor(0)
        this.exitPrompt.setDepth(100)
      }

      // Check for E key press
      if (Phaser.Input.Keyboard.JustDown(this.exitKey)) {
        this.exitLibrary()
      }
    } else {
      if (this.exitPrompt) {
        this.exitPrompt.destroy()
        this.exitPrompt = null
      }
    }
  }

  update(time: number, delta: number) {
    // Guard against update being called before async create() completes
    if (!this.inputManager || !this.player) {
      return
    }

    // Don't process player movement when elevator UI is open
    if (this.elevatorUI.isOpen()) {
      return
    }

    const directionVector = this.inputManager.getDirectionVector()
    const direction8Way = this.inputManager.getDirection8Way()

    this.player.move(directionVector, direction8Way)
  }

  private exitLibrary() {
    // Remove event listeners to prevent errors during transition
    this.events.off('postupdate')

    // Fade out before transitioning
    this.cameras.main.fadeOut(300, 0, 0, 0)

    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Transition back to outdoor scene
      this.scene.start('GameScene', {
        returnFromBuilding: true,
        playerPosition: this.previousPlayerPosition
      })
    })
  }
}
