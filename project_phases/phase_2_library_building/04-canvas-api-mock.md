# Ticket 04: Canvas API Mock Data

## Objective
Create mock Canvas module data structures based on the real Canvas GraphQL API response format. This allows us to develop the floor generation system before integrating with the actual API.

## Tasks

### 1. Create Canvas Type Definitions

Create `src/types/CanvasTypes.ts`:

```typescript
export interface CanvasModule {
  id: string
  _id: string
  name: string
  position: number
  published: boolean
  unlockAt: string | null
  requirementCount: number | null
  requireSequentialProgress: boolean | null
  prerequisites: string[]
  completionRequirements: any[]
  progression: ModuleProgression
  submissionStatistics: SubmissionStatistics
  moduleItemsTotalCount: number
}

export interface ModuleProgression {
  id: string
  _id: string
  workflowState: 'locked' | 'unlocked' | 'started' | 'completed'
  collapsed: boolean | null
  completedAt: string | null
  completed: boolean
  locked: boolean
  unlocked: boolean
  started: boolean
  currentPosition: number | null
  requirementsMet: string[]
  incompleteRequirements: string[]
}

export interface SubmissionStatistics {
  latestDueAt: string | null
  missingAssignmentCount: number
}

export interface CanvasModulesResponse {
  legacyNode: {
    modulesConnection: {
      edges: Array<{
        cursor: string
        node: CanvasModule
      }>
      pageInfo: {
        hasNextPage: boolean
        endCursor: string
      }
    }
  }
}
```

### 2. Create Mock Data Service

Create `src/services/MockCanvasService.ts`:

```typescript
import { CanvasModulesResponse, CanvasModule } from '../types/CanvasTypes'

export default class MockCanvasService {
  /**
   * Returns mock Canvas module data for development
   * This simulates the GraphQL API response structure
   */
  static getMockModules(): CanvasModulesResponse {
    return {
      legacyNode: {
        modulesConnection: {
          edges: [
            {
              cursor: 'MQ',
              node: {
                id: 'TW9kdWxlLTU1NDY1',
                _id: '55465',
                name: 'Introduction to TypeScript',
                position: 1,
                published: true,
                unlockAt: null,
                requirementCount: null,
                requireSequentialProgress: null,
                prerequisites: [],
                completionRequirements: [],
                progression: {
                  id: 'TW9kdWxlUHJvZ3Jlc3Npb24tMTM1OTAx',
                  _id: '135901',
                  workflowState: 'completed',
                  collapsed: null,
                  completedAt: '2025-09-30T12:38:58-06:00',
                  completed: true,
                  locked: false,
                  unlocked: false,
                  started: false,
                  currentPosition: null,
                  requirementsMet: [],
                  incompleteRequirements: []
                },
                submissionStatistics: {
                  latestDueAt: '2025-09-01T23:59:00-06:00',
                  missingAssignmentCount: 0
                },
                moduleItemsTotalCount: 5
              }
            },
            {
              cursor: 'Mg',
              node: {
                id: 'TW9kdWxlLTU1NDY2',
                _id: '55466',
                name: 'Phaser Game Development Basics',
                position: 2,
                published: true,
                unlockAt: null,
                requirementCount: null,
                requireSequentialProgress: null,
                prerequisites: [],
                completionRequirements: [],
                progression: {
                  id: 'TW9kdWxlUHJvZ3Jlc3Npb24tMTM1OTAy',
                  _id: '135902',
                  workflowState: 'started',
                  collapsed: null,
                  completedAt: null,
                  completed: false,
                  locked: false,
                  unlocked: true,
                  started: true,
                  currentPosition: 2,
                  requirementsMet: [],
                  incompleteRequirements: []
                },
                submissionStatistics: {
                  latestDueAt: '2025-09-15T23:59:00-06:00',
                  missingAssignmentCount: 2
                },
                moduleItemsTotalCount: 6
              }
            },
            {
              cursor: 'Mw',
              node: {
                id: 'TW9kdWxlLTU1NDY3',
                _id: '55467',
                name: 'Advanced Game Mechanics',
                position: 3,
                published: true,
                unlockAt: null,
                requirementCount: null,
                requireSequentialProgress: null,
                prerequisites: ['55466'],
                completionRequirements: [],
                progression: {
                  id: 'TW9kdWxlUHJvZ3Jlc3Npb24tMTM1OTAz',
                  _id: '135903',
                  workflowState: 'locked',
                  collapsed: null,
                  completedAt: null,
                  completed: false,
                  locked: true,
                  unlocked: false,
                  started: false,
                  currentPosition: null,
                  requirementsMet: [],
                  incompleteRequirements: []
                },
                submissionStatistics: {
                  latestDueAt: '2025-10-01T23:59:00-06:00',
                  missingAssignmentCount: 4
                },
                moduleItemsTotalCount: 4
              }
            },
            {
              cursor: 'NA',
              node: {
                id: 'TW9kdWxlLTU1NDY4',
                _id: '55468',
                name: 'Canvas LMS Integration',
                position: 4,
                published: true,
                unlockAt: '2025-10-10T00:00:00-06:00',
                requirementCount: null,
                requireSequentialProgress: null,
                prerequisites: [],
                completionRequirements: [],
                progression: {
                  id: 'TW9kdWxlUHJvZ3Jlc3Npb24tMTM1OTA0',
                  _id: '135904',
                  workflowState: 'locked',
                  collapsed: null,
                  completedAt: null,
                  completed: false,
                  locked: true,
                  unlocked: false,
                  started: false,
                  currentPosition: null,
                  requirementsMet: [],
                  incompleteRequirements: []
                },
                submissionStatistics: {
                  latestDueAt: '2025-10-15T23:59:00-06:00',
                  missingAssignmentCount: 5
                },
                moduleItemsTotalCount: 7
              }
            },
            {
              cursor: 'NQ',
              node: {
                id: 'TW9kdWxlLTU1NDY5',
                _id: '55469',
                name: 'Final Project Development',
                position: 5,
                published: true,
                unlockAt: null,
                requirementCount: null,
                requireSequentialProgress: true,
                prerequisites: ['55467', '55468'],
                completionRequirements: [],
                progression: {
                  id: 'TW9kdWxlUHJvZ3Jlc3Npb24tMTM1OTA1',
                  _id: '135905',
                  workflowState: 'locked',
                  collapsed: null,
                  completedAt: null,
                  completed: false,
                  locked: true,
                  unlocked: false,
                  started: false,
                  currentPosition: null,
                  requirementsMet: [],
                  incompleteRequirements: []
                },
                submissionStatistics: {
                  latestDueAt: '2025-10-30T23:59:00-06:00',
                  missingAssignmentCount: 1
                },
                moduleItemsTotalCount: 3
              }
            }
          ],
          pageInfo: {
            hasNextPage: false,
            endCursor: 'NQ'
          }
        }
      }
    }
  }

  /**
   * Extract modules array from API response format
   */
  static extractModules(response: CanvasModulesResponse): CanvasModule[] {
    return response.legacyNode.modulesConnection.edges.map(edge => edge.node)
  }

  /**
   * Get mock modules as simple array (convenience method)
   */
  static getMockModulesArray(): CanvasModule[] {
    const response = this.getMockModules()
    return this.extractModules(response)
  }

  /**
   * Simulate API delay for realistic testing
   */
  static async fetchModulesAsync(delayMs: number = 500): Promise<CanvasModule[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.getMockModulesArray())
      }, delayMs)
    })
  }
}
```

### 3. Create Module Status Helper

Create `src/utils/ModuleStatusHelper.ts`:

```typescript
import { CanvasModule } from '../types/CanvasTypes'

export default class ModuleStatusHelper {
  /**
   * Get human-readable status from module
   */
  static getStatus(module: CanvasModule): string {
    const { progression } = module

    if (progression.completed) return 'Completed'
    if (progression.locked) return 'Locked'
    if (progression.started) return 'In Progress'
    if (progression.unlocked) return 'Available'

    return 'Unknown'
  }

  /**
   * Get color for module status
   */
  static getStatusColor(module: CanvasModule): number {
    const { progression } = module

    if (progression.completed) return 0x00ff00  // Green
    if (progression.locked) return 0x888888     // Gray
    if (progression.started) return 0xffaa00    // Orange
    if (progression.unlocked) return 0x00aaff   // Blue

    return 0xffffff // White
  }

  /**
   * Get completion percentage (0-1)
   */
  static getCompletionPercentage(module: CanvasModule): number {
    if (module.progression.completed) return 1.0

    const { currentPosition, moduleItemsTotalCount } = module.progression
    if (!currentPosition || !moduleItemsTotalCount) return 0

    return currentPosition / moduleItemsTotalCount
  }

  /**
   * Check if module is accessible
   */
  static isAccessible(module: CanvasModule): boolean {
    return !module.progression.locked
  }

  /**
   * Get due date info
   */
  static getDueInfo(module: CanvasModule): string | null {
    const dueAt = module.submissionStatistics.latestDueAt
    if (!dueAt) return null

    const dueDate = new Date(dueAt)
    const now = new Date()

    if (dueDate < now) {
      return 'Past due'
    }

    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysUntilDue === 0) return 'Due today'
    if (daysUntilDue === 1) return 'Due tomorrow'
    if (daysUntilDue <= 7) return `Due in ${daysUntilDue} days`

    return dueDate.toLocaleDateString()
  }

  /**
   * Get missing assignments count
   */
  static getMissingCount(module: CanvasModule): number {
    return module.submissionStatistics.missingAssignmentCount
  }
}
```

### 4. Test Mock Data

Create a simple test file to verify mock data structure:

```typescript
// src/__tests__/mockCanvas.test.ts (optional)
import MockCanvasService from '../services/MockCanvasService'
import ModuleStatusHelper from '../utils/ModuleStatusHelper'

// Manual test - run in console
const testMockData = () => {
  const modules = MockCanvasService.getMockModulesArray()

  console.log('Mock Canvas Modules:')
  modules.forEach(module => {
    console.log(`\n${module.name}`)
    console.log(`  Status: ${ModuleStatusHelper.getStatus(module)}`)
    console.log(`  Items: ${module.moduleItemsTotalCount}`)
    console.log(`  Missing: ${ModuleStatusHelper.getMissingCount(module)}`)
    console.log(`  Due: ${ModuleStatusHelper.getDueInfo(module) || 'No due date'}`)
  })
}
```

## Testing Checklist

### Type Definitions
- [ ] CanvasTypes.ts compiles without errors
- [ ] All fields from sample API response are represented
- [ ] Type definitions match Canvas GraphQL schema

### Mock Data Service
- [ ] getMockModules() returns proper response structure
- [ ] extractModules() correctly pulls modules from edges
- [ ] getMockModulesArray() returns flat array
- [ ] fetchModulesAsync() adds realistic delay

### Module Status Helper
- [ ] getStatus() returns correct status strings
- [ ] getStatusColor() returns appropriate colors
- [ ] getCompletionPercentage() calculates correctly
- [ ] isAccessible() properly checks locked state
- [ ] getDueInfo() formats dates correctly
- [ ] getMissingCount() returns missing assignments

### Data Validation
- [ ] Mock data has 5 modules
- [ ] First module is completed
- [ ] Second module is in progress
- [ ] Third, fourth, fifth modules are locked
- [ ] Prerequisites are correctly set
- [ ] Dates are in future (except first module)

## Acceptance Criteria
- [ ] Type definitions match real Canvas API structure
- [ ] Mock service provides realistic test data
- [ ] Helper utilities correctly interpret module status
- [ ] Mock data covers all important states (completed, started, locked)
- [ ] Code is ready for real API integration (easy to swap mock for real)

## Dependencies
- None (this is foundational work)

## Estimated Time
1 hour

## Notes
- Mock data should closely match real API responses
- Include variety of module states for thorough testing
- Helper utilities will be used extensively in UI rendering
- Future: Move mock data to JSON file for easier editing
- Real API integration will happen in Phase 3
- Module positions determine floor order (position 1 = floor 1)
