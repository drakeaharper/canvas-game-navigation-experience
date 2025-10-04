import { CanvasModule, ModuleFloorData } from '../types/CanvasTypes'

/**
 * ModuleStatusHelper
 * Utility functions for interpreting Canvas module data for game visualization
 */
export default class ModuleStatusHelper {
  /**
   * Calculate completion percentage for a module
   */
  public static getCompletionPercentage(module: CanvasModule): number {
    if (!module.moduleItems || module.moduleItems.length === 0) {
      return 0
    }

    const itemsWithRequirements = module.moduleItems.filter(
      item => item.completionRequirement
    )

    if (itemsWithRequirements.length === 0) {
      return 0
    }

    const completedItems = itemsWithRequirements.filter(
      item => item.completionRequirement?.completed
    ).length

    return Math.round((completedItems / itemsWithRequirements.length) * 100)
  }

  /**
   * Get count of completed items
   */
  public static getCompletedItemCount(module: CanvasModule): number {
    if (!module.moduleItems || module.moduleItems.length === 0) {
      return 0
    }

    return module.moduleItems.filter(
      item => item.completionRequirement?.completed
    ).length
  }

  /**
   * Get total count of items with completion requirements
   */
  public static getTotalItemCount(module: CanvasModule): number {
    if (!module.moduleItems || module.moduleItems.length === 0) {
      return 0
    }

    return module.moduleItems.filter(
      item => item.completionRequirement
    ).length
  }

  /**
   * Check if module is accessible (unlocked and published)
   */
  public static isAccessible(module: CanvasModule): boolean {
    // Locked modules are not accessible
    if (module.state === 'locked') {
      return false
    }

    // Check if unlock date has passed
    if (module.unlockAt) {
      const unlockDate = new Date(module.unlockAt)
      const now = new Date()
      if (now < unlockDate) {
        return false
      }
    }

    return true
  }

  /**
   * Get display status text for a module
   */
  public static getStatusText(module: CanvasModule): string {
    if (module.state === 'completed') {
      return 'Completed'
    }

    if (module.state === 'locked') {
      if (module.unlockAt) {
        const unlockDate = new Date(module.unlockAt)
        return `Unlocks ${unlockDate.toLocaleDateString()}`
      }
      return 'Locked'
    }

    if (module.state === 'started') {
      const percentage = this.getCompletionPercentage(module)
      return `In Progress (${percentage}%)`
    }

    return 'Not Started'
  }

  /**
   * Get color theme for module based on status
   * Returns color codes for visual representation
   */
  public static getStatusColor(module: CanvasModule): {
    primary: number
    secondary: number
  } {
    switch (module.state) {
      case 'completed':
        return {
          primary: 0x22c55e,   // Green
          secondary: 0x16a34a
        }
      case 'started':
        return {
          primary: 0xeab308,   // Yellow
          secondary: 0xca8a04
        }
      case 'locked':
        return {
          primary: 0x71717a,   // Gray
          secondary: 0x52525b
        }
      case 'unlocked':
      default:
        return {
          primary: 0x3b82f6,   // Blue
          secondary: 0x2563eb
        }
    }
  }

  /**
   * Convert Canvas module to game floor data
   */
  public static convertToFloorData(
    module: CanvasModule,
    floorNumber: number
  ): ModuleFloorData {
    return {
      floorNumber,
      module,
      isAccessible: this.isAccessible(module),
      completionPercentage: this.getCompletionPercentage(module),
      itemCount: this.getTotalItemCount(module),
      completedItemCount: this.getCompletedItemCount(module)
    }
  }

  /**
   * Get prerequisite information for a module
   */
  public static getPrerequisiteInfo(
    module: CanvasModule,
    allModules: CanvasModule[]
  ): {
    hasPrerequisites: boolean
    prerequisiteNames: string[]
    prerequisitesMet: boolean
  } {
    if (!module.prerequisiteModuleIds || module.prerequisiteModuleIds.length === 0) {
      return {
        hasPrerequisites: false,
        prerequisiteNames: [],
        prerequisitesMet: true
      }
    }

    const prerequisites = allModules.filter(m =>
      module.prerequisiteModuleIds.includes(m._id)
    )

    const prerequisiteNames = prerequisites.map(m => m.name)
    const prerequisitesMet = prerequisites.every(m => m.state === 'completed')

    return {
      hasPrerequisites: true,
      prerequisiteNames,
      prerequisitesMet
    }
  }

  /**
   * Check if module has ungraded submissions
   */
  public static hasUngradedWork(module: CanvasModule): boolean {
    return (module.submissionStatistics?.ungraded || 0) > 0
  }

  /**
   * Check if module has missing submissions
   */
  public static hasMissingSubmissions(module: CanvasModule): boolean {
    return (module.submissionStatistics?.notSubmitted || 0) > 0
  }

  /**
   * Get a summary of module submission status
   */
  public static getSubmissionSummary(module: CanvasModule): string {
    const stats = module.submissionStatistics
    if (!stats) {
      return 'No submission data'
    }

    const total = stats.graded + stats.ungraded + stats.notSubmitted
    if (total === 0) {
      return 'No assignments'
    }

    const parts: string[] = []
    if (stats.graded > 0) parts.push(`${stats.graded} graded`)
    if (stats.ungraded > 0) parts.push(`${stats.ungraded} pending`)
    if (stats.notSubmitted > 0) parts.push(`${stats.notSubmitted} missing`)

    return parts.join(', ')
  }
}
