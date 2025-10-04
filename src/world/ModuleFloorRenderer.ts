import Phaser from 'phaser'
import { Floor } from './FloorManager'
import ModuleStatusHelper from '../utils/ModuleStatusHelper'

/**
 * ModuleFloorRenderer
 * Dynamically generates floor layouts based on Canvas module data
 * Each module gets a unique visual representation based on its state
 */
export default class ModuleFloorRenderer {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  /**
   * Render a module floor layout
   * Creates visual elements based on module state and content
   */
  public renderFloor(floor: Floor) {
    if (floor.floorType === 'lobby') {
      // Lobby is handled separately in LibraryInteriorScene
      return
    }

    if (!floor.moduleData) {
      console.warn(`Floor ${floor.floorNumber} has no module data`)
      return
    }

    const width = 800
    const height = 600

    // Clear any existing floor graphics for this floor
    // (Important when switching between floors)

    // Base floor color based on module state
    const colors = ModuleStatusHelper.getStatusColor(floor.moduleData)
    this.createBaseFloor(colors, width, height)

    // Walls
    this.createWalls()

    // Module information display
    this.createModuleInfoPanel(floor)

    // Module items display (assignments, quizzes, etc.)
    this.createModuleItemsDisplay(floor)

    // Progress visualization
    this.createProgressDisplay(floor)

    // Elevator (for navigation back)
    this.createElevatorArea()

    // Decorative elements based on completion status
    this.createDecorations(floor)
  }

  private createBaseFloor(
    colors: { primary: number; secondary: number },
    width: number,
    height: number
  ) {
    const floorGraphics = this.scene.add.graphics()

    // Base floor color
    floorGraphics.fillStyle(colors.primary, 0.2)
    floorGraphics.fillRect(0, 0, width, height)

    // Tile pattern
    floorGraphics.lineStyle(1, colors.secondary, 0.3)
    for (let x = 0; x < width; x += 64) {
      floorGraphics.lineBetween(x, 0, x, height)
    }
    for (let y = 0; y < height; y += 64) {
      floorGraphics.lineBetween(0, y, width, y)
    }
  }

  private createWalls() {
    const graphics = this.scene.add.graphics()

    // Wall color (consistent with lobby)
    graphics.fillStyle(0xd4a373, 1)

    // Top wall
    graphics.fillRect(0, 0, 800, 60)

    // Left wall
    graphics.fillRect(0, 0, 60, 600)

    // Right wall
    graphics.fillRect(740, 0, 60, 600)

    // Wall trim
    graphics.lineStyle(3, 0x8b6f47, 1)
    graphics.strokeRect(60, 60, 680, 480)
  }

  private createModuleInfoPanel(floor: Floor) {
    if (!floor.moduleData) return

    const centerX = 400
    const panelY = 100

    // Module name header
    this.scene.add.text(centerX, panelY, floor.name, {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000dd',
      padding: { x: 16, y: 8 },
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // Status text
    const statusText = ModuleStatusHelper.getStatusText(floor.moduleData)
    const statusColor = this.getStatusTextColor(floor.moduleData.state)

    this.scene.add.text(centerX, panelY + 40, statusText, {
      fontSize: '16px',
      color: statusColor,
      backgroundColor: '#000000dd',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5)

    // Completion info
    const completedItems = ModuleStatusHelper.getCompletedItemCount(floor.moduleData)
    const totalItems = ModuleStatusHelper.getTotalItemCount(floor.moduleData)

    if (totalItems > 0) {
      this.scene.add.text(
        centerX,
        panelY + 75,
        `${completedItems} of ${totalItems} items completed`,
        {
          fontSize: '14px',
          color: '#cccccc',
          backgroundColor: '#000000aa',
          padding: { x: 10, y: 5 }
        }
      ).setOrigin(0.5)
    }
  }

  private createModuleItemsDisplay(floor: Floor) {
    if (!floor.moduleData || !floor.moduleData.moduleItems) return

    const startX = 100
    const startY = 200
    const itemHeight = 35
    const maxVisibleItems = 8

    // Items container background
    const containerGraphics = this.scene.add.graphics()
    containerGraphics.fillStyle(0xffffff, 0.9)
    containerGraphics.fillRoundedRect(startX - 10, startY - 10, 600, maxVisibleItems * itemHeight + 20, 8)

    // Title
    this.scene.add.text(startX, startY - 40, 'Module Contents:', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000dd',
      padding: { x: 10, y: 5 },
      fontStyle: 'bold'
    })

    // Display module items
    const items = floor.moduleData.moduleItems.slice(0, maxVisibleItems)

    items.forEach((item, index) => {
      const y = startY + (index * itemHeight)
      const isCompleted = item.completionRequirement?.completed || false

      // Completion indicator
      const indicator = isCompleted ? '✓' : '○'
      const indicatorColor = isCompleted ? '#22c55e' : '#94a3b8'

      this.scene.add.text(startX, y, indicator, {
        fontSize: '18px',
        color: indicatorColor
      })

      // Item icon based on type
      const icon = this.getItemTypeIcon(item.type)
      this.scene.add.text(startX + 25, y, icon, {
        fontSize: '16px',
        color: '#000000'
      })

      // Item title
      const titleColor = isCompleted ? '#666666' : '#000000'
      this.scene.add.text(startX + 50, y, item.title, {
        fontSize: '14px',
        color: titleColor,
        fontStyle: isCompleted ? 'normal' : 'normal'
      })
    })

    // Show "more items" indicator if needed
    if (floor.moduleData.moduleItems.length > maxVisibleItems) {
      const remaining = floor.moduleData.moduleItems.length - maxVisibleItems
      this.scene.add.text(
        startX,
        startY + (maxVisibleItems * itemHeight) + 10,
        `+ ${remaining} more items`,
        {
          fontSize: '12px',
          color: '#666666',
          fontStyle: 'italic'
        }
      )
    }
  }

  private createProgressDisplay(floor: Floor) {
    if (!floor.moduleData) return

    const percentage = ModuleStatusHelper.getCompletionPercentage(floor.moduleData)
    const centerX = 400
    const barY = 520

    // Progress bar background
    const barWidth = 600
    const barHeight = 30

    const bgGraphics = this.scene.add.graphics()
    bgGraphics.fillStyle(0x333333, 1)
    bgGraphics.fillRoundedRect(centerX - barWidth / 2, barY, barWidth, barHeight, 8)

    // Progress bar fill
    const fillWidth = (barWidth - 4) * (percentage / 100)
    const fillColor = this.getProgressColor(percentage)

    const fillGraphics = this.scene.add.graphics()
    fillGraphics.fillStyle(fillColor, 1)
    fillGraphics.fillRoundedRect(centerX - barWidth / 2 + 2, barY + 2, fillWidth, barHeight - 4, 6)

    // Progress percentage text
    this.scene.add.text(centerX, barY + barHeight / 2, `${percentage}%`, {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // Progress label
    this.scene.add.text(centerX, barY - 15, 'Module Progress', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5)
  }

  private createElevatorArea() {
    const elevatorX = 700
    const elevatorY = 300

    // Elevator shaft
    const elevatorGraphics = this.scene.add.graphics()
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
    this.scene.add.text(elevatorX, elevatorY - 110, 'ELEVATOR', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5)

    // Store elevator bounds for interaction
    this.scene.registry.set('elevatorBounds', {
      x: elevatorX - 50,
      y: elevatorY - 80,
      width: 100,
      height: 160
    })
  }

  private createDecorations(floor: Floor) {
    if (!floor.moduleData) return

    // Add decorations based on module state
    if (floor.moduleData.state === 'completed') {
      // Gold stars for completed modules
      const stars = [
        { x: 100, y: 100 },
        { x: 700, y: 100 },
        { x: 100, y: 500 }
      ]

      stars.forEach(pos => {
        this.scene.add.text(pos.x, pos.y, '⭐', {
          fontSize: '32px'
        })
      })
    } else if (floor.moduleData.state === 'locked') {
      // Lock icons for locked modules
      this.scene.add.text(400, 300, '🔒', {
        fontSize: '64px',
        color: '#999999'
      }).setOrigin(0.5).setAlpha(0.3)
    }

    // Add plants for unlocked/started modules
    if (floor.moduleData.state === 'unlocked' || floor.moduleData.state === 'started') {
      const plantPositions = [
        { x: 100, y: 500 },
        { x: 700, y: 500 }
      ]

      plantPositions.forEach(pos => {
        this.scene.add.text(pos.x, pos.y, '🌿', {
          fontSize: '24px'
        })
      })
    }
  }

  private getItemTypeIcon(type: string): string {
    const iconMap: Record<string, string> = {
      'Assignment': '📝',
      'Quiz': '📋',
      'Discussion': '💬',
      'Page': '📄',
      'ExternalUrl': '🔗',
      'File': '📎',
      'ExternalTool': '🔧'
    }
    return iconMap[type] || '📌'
  }

  private getStatusTextColor(state: string): string {
    switch (state) {
      case 'completed':
        return '#22c55e' // Green
      case 'started':
        return '#eab308' // Yellow
      case 'locked':
        return '#ef4444' // Red
      case 'unlocked':
      default:
        return '#3b82f6' // Blue
    }
  }

  private getProgressColor(percentage: number): number {
    if (percentage === 100) return 0x22c55e // Green
    if (percentage >= 50) return 0xeab308 // Yellow
    if (percentage > 0) return 0x3b82f6 // Blue
    return 0x6b7280 // Gray
  }
}
