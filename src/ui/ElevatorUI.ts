import Phaser from 'phaser'
import { Floor } from '../world/FloorManager'

/**
 * ElevatorUI
 * Interactive floor selector for navigating between library floors
 * Displays a list of available floors and handles user input
 */
export default class ElevatorUI {
  private scene: Phaser.Scene
  private container!: Phaser.GameObjects.Container
  private floors: Floor[]
  private currentFloorNumber: number
  private isVisible: boolean = false
  private selectedIndex: number = 0
  private floorButtons: Phaser.GameObjects.GameObject[] = []
  private onFloorSelected?: (floorNumber: number) => void
  private keys: Phaser.Input.Keyboard.Key[] = []

  constructor(
    scene: Phaser.Scene,
    floors: Floor[],
    currentFloorNumber: number
  ) {
    this.scene = scene
    this.floors = floors
    this.currentFloorNumber = currentFloorNumber
  }

  /**
   * Show the elevator UI
   */
  public show(onFloorSelected: (floorNumber: number) => void) {
    if (this.isVisible) return

    this.onFloorSelected = onFloorSelected
    this.isVisible = true
    this.selectedIndex = this.currentFloorNumber

    this.createUI()
    this.setupInput()
  }

  /**
   * Clean up input handlers
   */
  private cleanupInput() {
    // Remove all key event listeners
    this.keys.forEach(key => {
      key.removeAllListeners()
    })
    this.keys = []
  }

  /**
   * Hide the elevator UI
   */
  public hide() {
    if (!this.isVisible) return

    this.isVisible = false

    // Clean up input handlers first
    this.cleanupInput()

    if (this.container) {
      this.container.destroy()
    }

    this.floorButtons = []
  }

  /**
   * Check if UI is currently visible
   */
  public isOpen(): boolean {
    return this.isVisible
  }

  private createUI() {
    const centerX = 400
    const centerY = 300

    // Create container
    this.container = this.scene.add.container(0, 0)
    this.container.setDepth(1000)
    this.container.setScrollFactor(0)

    // Semi-transparent overlay
    const overlay = this.scene.add.graphics()
    overlay.fillStyle(0x000000, 0.7)
    overlay.fillRect(0, 0, 800, 600)
    this.container.add(overlay)

    // Panel background
    const panelWidth = 500
    const panelHeight = 500
    const panelX = centerX - panelWidth / 2
    const panelY = centerY - panelHeight / 2

    const panel = this.scene.add.graphics()
    panel.fillStyle(0x2c3e50, 1)
    panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 12)

    // Panel border
    panel.lineStyle(3, 0x34495e, 1)
    panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 12)

    this.container.add(panel)

    // Title
    const title = this.scene.add.text(centerX, panelY + 30, 'Select Floor', {
      fontSize: '28px',
      color: '#ecf0f1',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    this.container.add(title)

    // Subtitle
    const subtitle = this.scene.add.text(
      centerX,
      panelY + 65,
      'Use ↑↓ Arrow Keys or W/S to navigate, Enter/E to select, ESC to close',
      {
        fontSize: '12px',
        color: '#95a5a6',
        align: 'center',
        wordWrap: { width: panelWidth - 40 }
      }
    ).setOrigin(0.5)
    this.container.add(subtitle)

    // Floor list
    const listStartY = panelY + 110
    const itemHeight = 60
    const itemSpacing = 10

    this.floors.forEach((floor, index) => {
      const itemY = listStartY + (index * (itemHeight + itemSpacing))

      this.createFloorItem(floor, index, panelX + 20, itemY, panelWidth - 40, itemHeight)
    })
  }

  private createFloorItem(
    floor: Floor,
    index: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const isSelected = index === this.selectedIndex
    const isCurrent = floor.floorNumber === this.currentFloorNumber
    const isAccessible = floor.accessible !== false

    // Item background
    const bg = this.scene.add.graphics()

    if (isSelected) {
      bg.fillStyle(0x3498db, 1) // Blue for selected
    } else if (isCurrent) {
      bg.fillStyle(0x27ae60, 0.8) // Green for current floor
    } else if (!isAccessible) {
      bg.fillStyle(0x7f8c8d, 0.5) // Gray for locked
    } else {
      bg.fillStyle(0x34495e, 0.8) // Default gray
    }

    bg.fillRoundedRect(x, y, width, height, 8)

    // Border for selected
    if (isSelected) {
      bg.lineStyle(3, 0xffffff, 1)
      bg.strokeRoundedRect(x, y, width, height, 8)
    }

    this.container.add(bg)
    this.floorButtons.push(bg)

    // Floor number badge
    const badgeSize = 40
    const badgeGraphics = this.scene.add.graphics()
    badgeGraphics.fillStyle(isAccessible ? 0x2c3e50 : 0x95a5a6, 1)
    badgeGraphics.fillCircle(x + badgeSize / 2 + 10, y + height / 2, badgeSize / 2)
    this.container.add(badgeGraphics)

    const floorNumText = this.scene.add.text(
      x + badgeSize / 2 + 10,
      y + height / 2,
      floor.floorNumber.toString(),
      {
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5)
    this.container.add(floorNumText)

    // Floor name
    const nameText = this.scene.add.text(x + badgeSize + 30, y + 15, floor.name, {
      fontSize: '18px',
      color: isAccessible ? '#ecf0f1' : '#95a5a6',
      fontStyle: 'bold'
    })
    this.container.add(nameText)

    // Floor status (for module floors)
    if (floor.floorType === 'module' && floor.status) {
      const statusText = this.scene.add.text(x + badgeSize + 30, y + 38, floor.status, {
        fontSize: '12px',
        color: '#95a5a6'
      })
      this.container.add(statusText)
    }

    // Current floor indicator
    if (isCurrent) {
      const indicator = this.scene.add.text(x + width - 100, y + height / 2, '◄ You are here', {
        fontSize: '12px',
        color: '#2ecc71',
        fontStyle: 'bold'
      }).setOrigin(0, 0.5)
      this.container.add(indicator)
    }

    // Locked indicator
    if (!isAccessible) {
      const lockIcon = this.scene.add.text(x + width - 30, y + height / 2, '🔒', {
        fontSize: '20px'
      }).setOrigin(0.5)
      this.container.add(lockIcon)
    }
  }

  private setupInput() {
    // Clean up any existing input handlers first
    this.cleanupInput()

    // Keyboard controls
    const upKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP, false)
    const downKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, false)
    const wKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W, false)
    const sKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S, false)
    const enterKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER, false)
    const eKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E, false)
    const escKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, false)

    // Store keys for cleanup
    this.keys = [upKey, downKey, wKey, sKey, enterKey, eKey, escKey]

    // Navigation
    upKey.on('down', () => {
      if (!this.isVisible) return
      this.moveSelection(-1)
    })

    downKey.on('down', () => {
      if (!this.isVisible) return
      this.moveSelection(1)
    })

    wKey.on('down', () => {
      if (!this.isVisible) return
      this.moveSelection(-1)
    })

    sKey.on('down', () => {
      if (!this.isVisible) return
      this.moveSelection(1)
    })

    // Selection
    enterKey.on('down', () => {
      if (!this.isVisible) return
      this.confirmSelection()
    })

    eKey.on('down', () => {
      if (!this.isVisible) return
      this.confirmSelection()
    })

    // Close
    escKey.on('down', () => {
      if (!this.isVisible) return
      this.hide()
    })
  }

  private moveSelection(direction: number) {
    const oldIndex = this.selectedIndex

    // Move selection
    this.selectedIndex += direction

    // Wrap around
    if (this.selectedIndex < 0) {
      this.selectedIndex = this.floors.length - 1
    } else if (this.selectedIndex >= this.floors.length) {
      this.selectedIndex = 0
    }

    // Update visual state if changed
    if (oldIndex !== this.selectedIndex) {
      this.updateSelectionVisuals()
    }
  }

  private updateSelectionVisuals() {
    // Destroy current container and recreate
    if (this.container) {
      this.container.destroy()
    }
    this.floorButtons = []

    // Recreate UI with new selection
    const centerX = 400
    const centerY = 300

    this.container = this.scene.add.container(0, 0)
    this.container.setDepth(1000)
    this.container.setScrollFactor(0)

    // Recreate all UI elements
    const overlay = this.scene.add.graphics()
    overlay.fillStyle(0x000000, 0.7)
    overlay.fillRect(0, 0, 800, 600)
    this.container.add(overlay)

    const panelWidth = 500
    const panelHeight = 500
    const panelX = centerX - panelWidth / 2
    const panelY = centerY - panelHeight / 2

    const panel = this.scene.add.graphics()
    panel.fillStyle(0x2c3e50, 1)
    panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 12)
    panel.lineStyle(3, 0x34495e, 1)
    panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 12)
    this.container.add(panel)

    const title = this.scene.add.text(centerX, panelY + 30, 'Select Floor', {
      fontSize: '28px',
      color: '#ecf0f1',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    this.container.add(title)

    const subtitle = this.scene.add.text(
      centerX,
      panelY + 65,
      'Use ↑↓ Arrow Keys or W/S to navigate, Enter/E to select, ESC to close',
      {
        fontSize: '12px',
        color: '#95a5a6',
        align: 'center',
        wordWrap: { width: panelWidth - 40 }
      }
    ).setOrigin(0.5)
    this.container.add(subtitle)

    const listStartY = panelY + 110
    const itemHeight = 60
    const itemSpacing = 10

    this.floors.forEach((floor, index) => {
      const itemY = listStartY + (index * (itemHeight + itemSpacing))
      this.createFloorItem(floor, index, panelX + 20, itemY, panelWidth - 40, itemHeight)
    })
  }

  private confirmSelection() {
    const selectedFloor = this.floors[this.selectedIndex]

    // Check if floor is accessible
    if (selectedFloor.accessible === false) {
      // Play error sound or show message
      console.log('Floor is locked')
      return
    }

    // Don't need to do anything if already on this floor
    if (selectedFloor.floorNumber === this.currentFloorNumber) {
      this.hide()
      return
    }

    // Transition to selected floor
    if (this.onFloorSelected) {
      this.onFloorSelected(selectedFloor.floorNumber)
    }

    this.hide()
  }

  /**
   * Update current floor (when externally changed)
   */
  public updateCurrentFloor(floorNumber: number) {
    this.currentFloorNumber = floorNumber
  }

  /**
   * Update floors list (when data changes)
   */
  public updateFloors(floors: Floor[]) {
    this.floors = floors

    // Refresh UI if visible
    if (this.isVisible) {
      const callback = this.onFloorSelected
      this.hide()
      if (callback) {
        this.show(callback)
      }
    }
  }
}
