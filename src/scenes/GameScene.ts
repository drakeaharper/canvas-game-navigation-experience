import Phaser from 'phaser'
import Player from '../sprites/Player'
import InputManager from '../utils/InputManager'
import { GAME_CONFIG } from '../config/GameConfig'
import BoundaryEffect from '../effects/BoundaryEffect'
import DebugKeys from '../utils/DebugKeys'

export default class GameScene extends Phaser.Scene {
  private player!: Player
  private inputManager!: InputManager
  private boundaries!: Phaser.Physics.Arcade.StaticGroup
  private boundaryEffect!: BoundaryEffect

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(
      0,
      0,
      GAME_CONFIG.world.width,
      GAME_CONFIG.world.height
    )

    // Create grass field using tileable grass texture
    this.createGrassField()
    this.createBoundaries()

    // Create player in center
    const centerX = GAME_CONFIG.world.width / 2
    const centerY = GAME_CONFIG.world.height / 2
    this.player = new Player(this, centerX, centerY)

    // Input setup
    this.inputManager = new InputManager(this)

    // Boundary effect
    this.boundaryEffect = new BoundaryEffect(this)

    // Camera setup
    this.cameras.main.setBounds(
      0,
      0,
      GAME_CONFIG.world.width,
      GAME_CONFIG.world.height
    )
    this.cameras.main.startFollow(
      this.player,
      true,
      GAME_CONFIG.camera.lerp,
      GAME_CONFIG.camera.lerp
    )

    // UI
    this.createUI()

    // Debug keys
    new DebugKeys(this)
  }

  private createGrassField() {
    const tileSize = 64
    const cols = Math.ceil(GAME_CONFIG.world.width / tileSize)
    const rows = Math.ceil(GAME_CONFIG.world.height / tileSize)

    // Fill the entire scene with grass tiles
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.add.image(x * tileSize, y * tileSize, 'grass-tile')
          .setOrigin(0, 0)
      }
    }
  }

  private createBoundaries() {
    this.boundaries = this.physics.add.staticGroup()

    const borderWidth = 8
    const worldWidth = GAME_CONFIG.world.width
    const worldHeight = GAME_CONFIG.world.height

    // Create visual boundary rectangles
    const borderColor = 0x8B4513 // Brown color for fence
    const graphics = this.add.graphics()
    graphics.fillStyle(borderColor, 1)

    // Top border
    graphics.fillRect(0, 0, worldWidth, borderWidth)

    // Bottom border
    graphics.fillRect(0, worldHeight - borderWidth, worldWidth, borderWidth)

    // Left border
    graphics.fillRect(0, 0, borderWidth, worldHeight)

    // Right border
    graphics.fillRect(worldWidth - borderWidth, 0, borderWidth, worldHeight)

    // Add decorative corner posts
    this.createCornerPosts()
  }

  private createCornerPosts() {
    const postSize = 16
    const positions = [
      { x: 0, y: 0 }, // Top-left
      { x: GAME_CONFIG.world.width - postSize, y: 0 }, // Top-right
      { x: 0, y: GAME_CONFIG.world.height - postSize }, // Bottom-left
      { x: GAME_CONFIG.world.width - postSize, y: GAME_CONFIG.world.height - postSize } // Bottom-right
    ]

    positions.forEach(pos => {
      const graphics = this.add.graphics()
      graphics.fillStyle(0x654321, 1) // Darker brown for posts
      graphics.fillRect(pos.x, pos.y, postSize, postSize)

      // Add a lighter top for 3D effect
      graphics.fillStyle(0x8B6914, 1)
      graphics.fillRect(pos.x, pos.y, postSize, 4)
    })
  }

  private createUI() {
    const infoText = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(100)

    // FPS counter (top-right corner)
    const fpsText = this.add.text(
      GAME_CONFIG.world.width - 10,
      10,
      '',
      {
        fontSize: '12px',
        color: '#00ff00',
        backgroundColor: '#000000aa',
        padding: { x: 6, y: 3 }
      }
    ).setScrollFactor(0).setDepth(100).setOrigin(1, 0)

    // Update UI every frame
    this.events.on('postupdate', () => {
      const velocity = this.player.getVelocity()
      const speed = velocity.length().toFixed(0)
      const direction = this.player.getCurrentDirection()

      infoText.setText([
        'Canvas Course World - MVP',
        'Use Arrow Keys or WASD to move',
        `Direction: ${direction}`,
        `Speed: ${speed} px/s`
      ])

      // Update FPS
      const fps = Math.round(this.game.loop.actualFps)
      fpsText.setText(`FPS: ${fps}`)

      // Color code based on performance
      if (fps >= 55) {
        fpsText.setColor('#00ff00') // Green - good
      } else if (fps >= 30) {
        fpsText.setColor('#ffff00') // Yellow - okay
      } else {
        fpsText.setColor('#ff0000') // Red - poor
      }
    })
  }

  update(time: number, delta: number) {
    const directionVector = this.inputManager.getDirectionVector()
    const direction8Way = this.inputManager.getDirection8Way()

    this.player.move(directionVector, direction8Way)

    // Check for boundary collision
    const worldBounds = this.physics.world.bounds
    if (this.player.checkBoundaryCollision(worldBounds, time)) {
      const pos = this.player.getPosition()

      // Determine which boundary was hit
      let direction: 'top' | 'bottom' | 'left' | 'right' = 'top'

      if (pos.y <= 20) direction = 'top'
      else if (pos.y >= worldBounds.height - 20) direction = 'bottom'
      else if (pos.x <= 20) direction = 'left'
      else if (pos.x >= worldBounds.width - 20) direction = 'right'

      this.boundaryEffect.showBoundaryHit(pos.x, pos.y, direction)
    }
  }
}
