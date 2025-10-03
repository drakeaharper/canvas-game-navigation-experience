import Phaser from 'phaser'
import Building, { BuildingType, BuildingConfig } from '../sprites/Building'
import { GAME_CONFIG } from '../config/GameConfig'
import Player from '../sprites/Player'

export default class BuildingManager {
  private scene: Phaser.Scene
  private buildings: Map<BuildingType, Building> = new Map()

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public createAllBuildings() {
    // City Hall (Assignments) - West side
    const cityHall = new Building(
      this.scene,
      GAME_CONFIG.buildings.cityHall.x,
      GAME_CONFIG.buildings.cityHall.y,
      {
        type: BuildingType.CITY_HALL,
        name: 'City Hall',
        description: 'Assignment Office - Where official tasks are posted',
        canvasFeature: 'assignments'
      }
    )
    this.buildings.set(BuildingType.CITY_HALL, cityHall)

    // Grand Social Hall (Discussions) - Center-west
    const socialHall = new Building(
      this.scene,
      GAME_CONFIG.buildings.socialHall.x,
      GAME_CONFIG.buildings.socialHall.y,
      {
        type: BuildingType.SOCIAL_HALL,
        name: 'Grand Social Hall',
        description: 'Discussion Forum - Where townspeople gather to talk',
        canvasFeature: 'discussions'
      }
    )
    this.buildings.set(BuildingType.SOCIAL_HALL, socialHall)

    // University Library (Modules) - Center-east
    const library = new Building(
      this.scene,
      GAME_CONFIG.buildings.library.x,
      GAME_CONFIG.buildings.library.y,
      {
        type: BuildingType.LIBRARY,
        name: 'University Library',
        description: 'Learning Center - Study materials and courses',
        canvasFeature: 'modules'
      }
    )
    this.buildings.set(BuildingType.LIBRARY, library)

    // Accounting House (Grades) - East side
    const accountingHouse = new Building(
      this.scene,
      GAME_CONFIG.buildings.accountingHouse.x,
      GAME_CONFIG.buildings.accountingHouse.y,
      {
        type: BuildingType.ACCOUNTING,
        name: 'Accounting House',
        description: 'Records Office - View your progress and grades',
        canvasFeature: 'grades'
      }
    )
    this.buildings.set(BuildingType.ACCOUNTING, accountingHouse)
  }

  public getBuilding(type: BuildingType): Building | undefined {
    return this.buildings.get(type)
  }

  public getAllBuildings(): Building[] {
    return Array.from(this.buildings.values())
  }

  public getNearestBuilding(x: number, y: number): Building | null {
    let nearest: Building | null = null
    let minDistance = Infinity

    this.buildings.forEach(building => {
      const dx = building.x - x
      const dy = building.y - y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < minDistance) {
        minDistance = distance
        nearest = building
      }
    })

    // Only return if within reasonable distance (300px)
    return minDistance < 300 ? nearest : null
  }

  public setupCollisions(player: Player) {
    // Create collision between player and all buildings
    this.buildings.forEach(building => {
      this.scene.physics.add.collider(player, building)
    })
  }
}
