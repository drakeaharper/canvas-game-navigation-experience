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
    // Get buildings from scene
    const gameScene = this.scene as any
    if (!gameScene.buildingManager) return null

    const buildings = gameScene.buildingManager.getAllBuildings()
    const playerPos = this.player.getPosition()

    let nearestBuilding: Building | null = null
    let minDistance = Infinity

    // Clear all highlights first
    buildings.forEach((building: Building) => {
      building.setHighlighted(false)
    })

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
      nearestBuilding.setHighlighted(true)
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
