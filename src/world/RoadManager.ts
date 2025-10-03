import Phaser from 'phaser'
import { GAME_CONFIG } from '../config/GameConfig'

export default class RoadManager {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public createMainStreet(buildingPositions: Array<{ x: number; y: number }>) {
    const tileSize = 64
    const roadY = GAME_CONFIG.roads.mainStreetY
    const roadHeight = 3 // 3 tiles high

    // Calculate leftmost and rightmost building positions
    const xPositions = buildingPositions.map(b => b.x)
    const leftEdge = 0
    const rightEdge = GAME_CONFIG.world.width

    // Create horizontal road tiles
    const cols = Math.ceil(GAME_CONFIG.world.width / tileSize)

    for (let y = 0; y < roadHeight; y++) {
      for (let x = 0; x < cols; x++) {
        this.scene.add.image(x * tileSize, (roadY - tileSize) + (y * tileSize), 'road-tile')
          .setOrigin(0, 0)
          .setDepth(1) // Above grass (0) but below buildings (5)
      }
    }
  }

  public createVerticalPaths(buildingPositions: Array<{ x: number; y: number }>) {
    const tileSize = 64
    const roadY = GAME_CONFIG.roads.mainStreetY
    const pathWidth = 2 // 2 tiles wide

    buildingPositions.forEach(building => {
      // Create vertical path from building to main road
      const startY = building.y + tileSize // Below building
      const endY = roadY - tileSize

      const rows = Math.ceil((endY - startY) / tileSize)

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < pathWidth; x++) {
          const tileX = building.x - tileSize + (x * tileSize)
          const tileY = startY + (y * tileSize)

          this.scene.add.image(tileX, tileY, 'road-tile')
            .setOrigin(0, 0)
            .setDepth(1)
        }
      }
    })
  }

  public createDecorations(buildingPositions: Array<{ x: number; y: number }>) {
    // Add street lamps along main road
    const lampSpacing = 250
    const roadY = GAME_CONFIG.roads.mainStreetY

    for (let x = lampSpacing; x < GAME_CONFIG.world.width; x += lampSpacing) {
      // North side lamps
      this.createStreetLamp(x, roadY - 96)

      // South side lamps
      this.createStreetLamp(x, roadY + 96)
    }
  }

  private createStreetLamp(x: number, y: number) {
    const graphics = this.scene.add.graphics()

    // Lamp post (brown)
    graphics.fillStyle(0x654321, 1)
    graphics.fillRect(x - 3, y, 6, 30)

    // Lamp top (yellow/gold)
    graphics.fillStyle(0xFFD700, 1)
    graphics.fillCircle(x, y - 3, 8)

    // Glow effect
    graphics.fillStyle(0xFFFF99, 0.3)
    graphics.fillCircle(x, y - 3, 12)

    graphics.setDepth(2) // Above roads
  }
}
