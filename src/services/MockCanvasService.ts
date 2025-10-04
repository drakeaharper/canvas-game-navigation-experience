import { CanvasModule, CanvasModulesResponse } from '../types/CanvasTypes'

/**
 * MockCanvasService
 * Provides realistic mock data for Canvas modules during development
 * Will be replaced with real Canvas API client in future phase
 */
export default class MockCanvasService {
  /**
   * Simulates fetching course modules from Canvas API
   * Returns a response matching the GraphQL structure
   */
  public static async getCourseModules(courseId: string): Promise<CanvasModulesResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      course: {
        modulesConnection: {
          nodes: this.getMockModules()
        }
      }
    }
  }

  /**
   * Generate mock module data for testing
   * Represents a typical course structure with 5 modules
   */
  private static getMockModules(): CanvasModule[] {
    return [
      {
        _id: 'module_1',
        id: '101',
        name: 'Introduction to Computer Science',
        position: 1,
        state: 'completed',
        unlockAt: null,
        prerequisiteModuleIds: [],
        requireSequentialProgress: false,
        publishDate: '2025-09-01T08:00:00Z',
        progression: {
          completedAt: '2025-09-15T14:30:00Z',
          requirementsMet: true
        },
        submissionStatistics: {
          graded: 3,
          ungraded: 0,
          notSubmitted: 0
        },
        moduleItems: [
          {
            _id: 'item_1',
            id: '1001',
            title: 'Welcome and Course Overview',
            type: 'Page',
            position: 1,
            indent: 0,
            content: {
              id: '1001',
              title: 'Welcome and Course Overview',
              __typename: 'Page'
            },
            published: true,
            completionRequirement: {
              type: 'must_view',
              completed: true
            }
          },
          {
            _id: 'item_2',
            id: '1002',
            title: 'Introduction Quiz',
            type: 'Quiz',
            position: 2,
            indent: 0,
            content: {
              id: '1002',
              title: 'Introduction Quiz',
              __typename: 'Quiz'
            },
            published: true,
            completionRequirement: {
              type: 'min_score',
              completed: true
            }
          },
          {
            _id: 'item_3',
            id: '1003',
            title: 'Hello World Assignment',
            type: 'Assignment',
            position: 3,
            indent: 0,
            content: {
              id: '1003',
              title: 'Hello World Assignment',
              __typename: 'Assignment'
            },
            published: true,
            completionRequirement: {
              type: 'must_submit',
              completed: true
            }
          }
        ]
      },
      {
        _id: 'module_2',
        id: '102',
        name: 'Data Structures and Algorithms',
        position: 2,
        state: 'started',
        unlockAt: null,
        prerequisiteModuleIds: ['module_1'],
        requireSequentialProgress: true,
        publishDate: '2025-09-08T08:00:00Z',
        progression: {
          completedAt: null,
          requirementsMet: false
        },
        submissionStatistics: {
          graded: 2,
          ungraded: 1,
          notSubmitted: 2
        },
        moduleItems: [
          {
            _id: 'item_4',
            id: '1004',
            title: 'Arrays and Lists',
            type: 'Page',
            position: 1,
            indent: 0,
            content: {
              id: '1004',
              title: 'Arrays and Lists',
              __typename: 'Page'
            },
            published: true,
            completionRequirement: {
              type: 'must_view',
              completed: true
            }
          },
          {
            _id: 'item_5',
            id: '1005',
            title: 'Implement Stack',
            type: 'Assignment',
            position: 2,
            indent: 0,
            content: {
              id: '1005',
              title: 'Implement Stack',
              __typename: 'Assignment'
            },
            published: true,
            completionRequirement: {
              type: 'must_submit',
              completed: true
            }
          },
          {
            _id: 'item_6',
            id: '1006',
            title: 'Big O Notation Quiz',
            type: 'Quiz',
            position: 3,
            indent: 0,
            content: {
              id: '1006',
              title: 'Big O Notation Quiz',
              __typename: 'Quiz'
            },
            published: true,
            completionRequirement: {
              type: 'min_score',
              completed: false
            }
          },
          {
            _id: 'item_7',
            id: '1007',
            title: 'Sorting Algorithms Project',
            type: 'Assignment',
            position: 4,
            indent: 0,
            content: {
              id: '1007',
              title: 'Sorting Algorithms Project',
              __typename: 'Assignment'
            },
            published: true,
            completionRequirement: {
              type: 'must_submit',
              completed: false
            }
          },
          {
            _id: 'item_8',
            id: '1008',
            title: 'Data Structures Discussion',
            type: 'Discussion',
            position: 5,
            indent: 0,
            content: {
              id: '1008',
              title: 'Data Structures Discussion',
              __typename: 'Discussion'
            },
            published: true,
            completionRequirement: {
              type: 'must_contribute',
              completed: false
            }
          }
        ]
      },
      {
        _id: 'module_3',
        id: '103',
        name: 'Object-Oriented Programming',
        position: 3,
        state: 'unlocked',
        unlockAt: null,
        prerequisiteModuleIds: ['module_2'],
        requireSequentialProgress: false,
        publishDate: '2025-09-15T08:00:00Z',
        progression: {
          completedAt: null,
          requirementsMet: false
        },
        submissionStatistics: {
          graded: 0,
          ungraded: 0,
          notSubmitted: 4
        },
        moduleItems: [
          {
            _id: 'item_9',
            id: '1009',
            title: 'Classes and Objects',
            type: 'Page',
            position: 1,
            indent: 0,
            content: {
              id: '1009',
              title: 'Classes and Objects',
              __typename: 'Page'
            },
            published: true,
            completionRequirement: {
              type: 'must_view',
              completed: false
            }
          },
          {
            _id: 'item_10',
            id: '1010',
            title: 'Inheritance Lab',
            type: 'Assignment',
            position: 2,
            indent: 0,
            content: {
              id: '1010',
              title: 'Inheritance Lab',
              __typename: 'Assignment'
            },
            published: true,
            completionRequirement: {
              type: 'must_submit',
              completed: false
            }
          },
          {
            _id: 'item_11',
            id: '1011',
            title: 'Polymorphism Examples',
            type: 'Page',
            position: 3,
            indent: 0,
            content: {
              id: '1011',
              title: 'Polymorphism Examples',
              __typename: 'Page'
            },
            published: true,
            completionRequirement: {
              type: 'must_view',
              completed: false
            }
          },
          {
            _id: 'item_12',
            id: '1012',
            title: 'Design Patterns Assignment',
            type: 'Assignment',
            position: 4,
            indent: 0,
            content: {
              id: '1012',
              title: 'Design Patterns Assignment',
              __typename: 'Assignment'
            },
            published: true,
            completionRequirement: {
              type: 'must_submit',
              completed: false
            }
          }
        ]
      },
      {
        _id: 'module_4',
        id: '104',
        name: 'Web Development Fundamentals',
        position: 4,
        state: 'locked',
        unlockAt: '2025-10-01T08:00:00Z',
        prerequisiteModuleIds: ['module_3'],
        requireSequentialProgress: true,
        publishDate: '2025-10-01T08:00:00Z',
        progression: {
          completedAt: null,
          requirementsMet: false
        },
        moduleItems: [
          {
            _id: 'item_13',
            id: '1013',
            title: 'HTML Basics',
            type: 'Page',
            position: 1,
            indent: 0,
            content: {
              id: '1013',
              title: 'HTML Basics',
              __typename: 'Page'
            },
            published: true
          },
          {
            _id: 'item_14',
            id: '1014',
            title: 'CSS Styling Project',
            type: 'Assignment',
            position: 2,
            indent: 0,
            content: {
              id: '1014',
              title: 'CSS Styling Project',
              __typename: 'Assignment'
            },
            published: true
          },
          {
            _id: 'item_15',
            id: '1015',
            title: 'JavaScript Fundamentals',
            type: 'Quiz',
            position: 3,
            indent: 0,
            content: {
              id: '1015',
              title: 'JavaScript Fundamentals',
              __typename: 'Quiz'
            },
            published: true
          }
        ]
      },
      {
        _id: 'module_5',
        id: '105',
        name: 'Final Project',
        position: 5,
        state: 'locked',
        unlockAt: '2025-10-15T08:00:00Z',
        prerequisiteModuleIds: ['module_4'],
        requireSequentialProgress: false,
        publishDate: '2025-10-15T08:00:00Z',
        progression: {
          completedAt: null,
          requirementsMet: false
        },
        moduleItems: [
          {
            _id: 'item_16',
            id: '1016',
            title: 'Project Requirements',
            type: 'Page',
            position: 1,
            indent: 0,
            content: {
              id: '1016',
              title: 'Project Requirements',
              __typename: 'Page'
            },
            published: true
          },
          {
            _id: 'item_17',
            id: '1017',
            title: 'Final Project Submission',
            type: 'Assignment',
            position: 2,
            indent: 0,
            content: {
              id: '1017',
              title: 'Final Project Submission',
              __typename: 'Assignment'
            },
            published: true
          },
          {
            _id: 'item_18',
            id: '1018',
            title: 'Peer Review Discussion',
            type: 'Discussion',
            position: 3,
            indent: 0,
            content: {
              id: '1018',
              title: 'Peer Review Discussion',
              __typename: 'Discussion'
            },
            published: true
          }
        ]
      }
    ]
  }

  /**
   * Get a single module by ID
   */
  public static async getModule(courseId: string, moduleId: string): Promise<CanvasModule | null> {
    const response = await this.getCourseModules(courseId)
    return response.course.modulesConnection.nodes.find(m => m.id === moduleId) || null
  }
}
