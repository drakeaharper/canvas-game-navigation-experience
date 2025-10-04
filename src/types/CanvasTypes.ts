// Canvas LMS Module Types
// Based on Canvas GraphQL API structure

export interface SubmissionStatistics {
  graded: number
  ungraded: number
  notSubmitted: number
}

export interface ModuleProgression {
  completedAt: string | null
  requirementsMet: boolean
}

export interface CanvasModule {
  _id: string
  id: string
  name: string
  position: number
  state: 'locked' | 'unlocked' | 'started' | 'completed'
  unlockAt: string | null
  prerequisiteModuleIds: string[]
  requireSequentialProgress: boolean
  publishDate: string | null
  moduleItems: ModuleItem[]
  progression: ModuleProgression
  submissionStatistics?: SubmissionStatistics
}

export interface ModuleItem {
  _id: string
  id: string
  title: string
  type: 'Assignment' | 'Quiz' | 'Discussion' | 'Page' | 'ExternalUrl' | 'File' | 'ExternalTool'
  position: number
  indent: number
  content: {
    id: string
    title: string
    __typename: string
  }
  published: boolean
  completionRequirement?: {
    type: 'must_view' | 'must_contribute' | 'must_submit' | 'min_score' | 'must_mark_done'
    completed: boolean
  }
}

export interface CanvasModulesResponse {
  course: {
    modulesConnection: {
      nodes: CanvasModule[]
    }
  }
}

// Helper types for game use
export interface ModuleFloorData {
  floorNumber: number
  module: CanvasModule
  isAccessible: boolean
  completionPercentage: number
  itemCount: number
  completedItemCount: number
}
