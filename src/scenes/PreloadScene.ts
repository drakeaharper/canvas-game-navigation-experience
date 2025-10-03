import Phaser from 'phaser'
import AnimationManager from '../utils/AnimationManager'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    const centerX = this.cameras.main.centerX
    const centerY = this.cameras.main.centerY

    // Create loading bar background
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(centerX - 160, centerY - 30, 320, 50)

    // Loading text
    const loadingText = this.add.text(centerX, centerY - 50, 'Loading Canvas Course World...', {
      fontSize: '20px',
      color: '#ffffff'
    })
    loadingText.setOrigin(0.5)

    // Percentage text
    const percentText = this.add.text(centerX, centerY, '0%', {
      fontSize: '18px',
      color: '#ffffff'
    })
    percentText.setOrigin(0.5)

    // Asset text
    const assetText = this.add.text(centerX, centerY + 50, '', {
      fontSize: '14px',
      color: '#ffffff'
    })
    assetText.setOrigin(0.5)

    // Update progress bar
    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0x4CAF50, 1)
      progressBar.fillRect(centerX - 150, centerY - 20, 300 * value, 30)
      percentText.setText(`${Math.round(value * 100)}%`)
    })

    // Update asset being loaded
    this.load.on('fileprogress', (file: any) => {
      assetText.setText(`Loading: ${file.key}`)
    })

    // Complete
    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
      percentText.destroy()
      assetText.destroy()
    })

    // Create procedural textures
    this.createGrassTexture()
    this.createRoadTexture()

    // Load building assets
    this.loadBuildingAssets()

    // Load player assets
    this.loadPlayerAssets()
  }

  private createGrassTexture() {
    const graphics = this.add.graphics()

    // Base grass color
    graphics.fillStyle(0x4CAF50, 1)
    graphics.fillRect(0, 0, 64, 64)

    // Add some darker grass patches for texture
    graphics.fillStyle(0x388E3C, 1)
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 64
      const y = Math.random() * 64
      const size = Math.random() * 8 + 4
      graphics.fillRect(x, y, size, size)
    }

    // Generate texture from graphics
    graphics.generateTexture('grass-tile', 64, 64)
    graphics.destroy()
  }

  private createRoadTexture() {
    const graphics = this.add.graphics()

    // Base road/dirt color (brown)
    graphics.fillStyle(0x8B7355, 1)
    graphics.fillRect(0, 0, 64, 64)

    // Add darker cobblestone texture
    graphics.fillStyle(0x6B5645, 1)
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 64
      const y = Math.random() * 64
      const size = Math.random() * 10 + 6
      graphics.fillRect(x, y, size, size)
    }

    // Add some lighter highlights for variation
    graphics.fillStyle(0x9B8365, 0.7)
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 64
      const y = Math.random() * 64
      const size = Math.random() * 6 + 3
      graphics.fillRect(x, y, size, size)
    }

    // Generate texture from graphics
    graphics.generateTexture('road-tile', 64, 64)
    graphics.destroy()
  }

  private loadBuildingAssets() {
    // Load the 4 primary building sprites (top-down perspective)
    this.load.image('building-city-hall', 'assets/buildings/city_hall.png')
    this.load.image('building-social-hall', 'assets/buildings/social_hall.png')
    this.load.image('building-library', 'assets/buildings/university_library.png')
    this.load.image('building-accounting', 'assets/buildings/accounting_house.png')
  }

  private loadPlayerAssets() {
    const basePath = 'assets/characters/player'

    // Load rotation sprites (static poses for each direction)
    this.load.image('player-north', `${basePath}/rotations/north.png`)
    this.load.image('player-north-east', `${basePath}/rotations/north-east.png`)
    this.load.image('player-east', `${basePath}/rotations/east.png`)
    this.load.image('player-south-east', `${basePath}/rotations/south-east.png`)
    this.load.image('player-south', `${basePath}/rotations/south.png`)
    this.load.image('player-south-west', `${basePath}/rotations/south-west.png`)
    this.load.image('player-west', `${basePath}/rotations/west.png`)
    this.load.image('player-north-west', `${basePath}/rotations/north-west.png`)

    // Load walk animation frames
    // Each direction has 6 frames (frame_000 through frame_005)
    const walkDirections = ['north', 'south', 'east', 'west']

    walkDirections.forEach(direction => {
      for (let i = 0; i < 6; i++) {
        const frameNum = i.toString().padStart(3, '0')
        const key = `player-walk-${direction}-${i}`
        const path = `${basePath}/animations/walk/${direction}/frame_${frameNum}.png`
        this.load.image(key, path)
      }
    })
  }

  create() {
    // Create animations before transitioning to game scene
    const animManager = new AnimationManager(this)
    animManager.createPlayerAnimations()

    // Transition to game scene
    this.scene.start('GameScene')
  }
}
