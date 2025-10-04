import Phaser from 'phaser'
import { CanvasModule } from '../types/CanvasTypes'
import ModuleStatusHelper from '../utils/ModuleStatusHelper'

export interface Floor {
  floorNumber: number
  floorType: 'lobby' | 'module'
  name: string
  moduleId?: string
  moduleData?: CanvasModule
  status?: string
  accessible?: boolean
}

export default class FloorManager {
  private scene: Phaser.Scene
  private floors: Floor[] = []
  private currentFloor: number = 0

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public initializeFloors(moduleData?: CanvasModule[]) {
    this.floors = []

    // Floor 0 is always the lobby
    this.floors.push({
      floorNumber: 0,
      floorType: 'lobby',
      name: 'Lobby',
      accessible: true
    })

    // Add module floors if data provided
    if (moduleData && moduleData.length > 0) {
      // Sort modules by position
      const sortedModules = [...moduleData].sort((a, b) => a.position - b.position)

      sortedModules.forEach((module, index) => {
        const floorNumber = index + 1 // Floor 1, 2, 3, etc.

        this.floors.push({
          floorNumber,
          floorType: 'module',
          name: module.name,
          moduleId: module.id,
          moduleData: module,
          status: ModuleStatusHelper.getStatusText(module),
          accessible: ModuleStatusHelper.isAccessible(module)
        })
      })
    }
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

  public getCurrentFloorNumber(): number {
    return this.currentFloor
  }
}
