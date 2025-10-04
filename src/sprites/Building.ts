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
  private buildingType: BuildingType
  private buildingName: string
  private buildingDescription: string
  private canvasFeature: string
  private label!: Phaser.GameObjects.Text

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

    // Set origin to bottom-center for isometric placement
    this.setOrigin(0.5, 1)

    // Buildings render above roads (1) but below player (10)
    this.setDepth(5)

    // Scale down the large top-down building sprites
    this.setScale(0.35)

    // Configure collision box
    this.setupCollisionBox()

    // Create label above building
    this.createLabel()
  }

  private setupCollisionBox() {
    const body = this.body as Phaser.Physics.Arcade.StaticBody

    // Get collision config based on building type
    const config = this.getCollisionConfig()
    body.setSize(config.width, config.height)
    body.setOffset(config.offsetX, config.offsetY)
  }

  private getCollisionConfig(): {
    width: number
    height: number
    offsetX: number
    offsetY: number
  } {
    // Collision configs for top-down perspective buildings
    // These buildings are proper top-down view, so collision should cover
    // the entire building footprint (not just the base)

    // Since we don't know the exact pixel dimensions yet, using conservative values
    // that will cover most of the building while leaving walkable space around it

    // All buildings get similar collision boxes for now
    // Can be fine-tuned per building type after testing
    return {
      width: 100,   // Cover most of building width
      height: 80,   // Cover most of building height
      offsetX: 14,  // Center horizontally
      offsetY: 20   // Start from near top of building
    }
  }

  private createLabel() {
    // Position label above building (accounting for scale)
    const labelY = this.y - (this.height * this.scaleY) - 10

    this.label = this.scene.add.text(this.x, labelY, this.buildingName, {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 }
    })
    this.label.setOrigin(0.5, 1)
    this.label.setDepth(6) // Above building sprite

    // Add subtle shadow for better visibility
    this.label.setStroke('#000000', 2)
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

  public setHighlighted(highlighted: boolean) {
    if (highlighted) {
      this.setTint(0xffff88) // Slight yellow tint
    } else {
      this.clearTint()
    }
  }

  public showInteractionPrompt() {
    // Future: Show "Press E to enter" prompt
  }

  public hideInteractionPrompt() {
    // Future: Hide interaction prompt
  }
}
