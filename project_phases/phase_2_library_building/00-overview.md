# Phase 2: Library Building (Modules)

## Overview
Implement the University Library building as an interactive multi-floor structure where each floor represents a Canvas module. Players can enter the library, navigate floors via elevator, and view their module progress.

## Goals
- Create interactive building entry/exit system
- Build multi-floor library interior based on Canvas modules data
- Implement elevator navigation between floors
- Display module progress visually on each floor
- Static lobby floor that's always present
- Dynamic floors generated from Canvas API response

## Canvas API Integration
The library will use Canvas GraphQL API to fetch modules:
- Endpoint: `GET /api/v1/courses/:course_id/modules`
- Each module becomes a floor in the library
- Module progression data determines visual state of floor
- Missing assignments and completion status shown visually

## Success Criteria
- [ ] Press 'E' near library entrance to enter building
- [ ] Smooth transition from outdoor world to library interior
- [ ] Lobby floor always renders (ground floor)
- [ ] Each Canvas module creates a separate floor above lobby
- [ ] Elevator allows quick navigation between floors
- [ ] Module completion status visible on each floor
- [ ] Press 'E' at exit to return to outdoor world
- [ ] Player position preserved when exiting building

## Technical Architecture

### Building Interior Scene
New Phaser scene: `LibraryInteriorScene`
- Separate scene from main game world
- Handles floor rendering and elevator logic
- Receives module data as scene data parameter

### Floor Structure
```typescript
interface LibraryFloor {
  floorNumber: number
  moduleId?: string  // undefined for lobby
  moduleName?: string
  moduleData?: CanvasModule
  floorType: 'lobby' | 'module'
}
```

### Elevator System
- Interactive elevator sprite in each floor
- Shows floor selector UI when player presses 'E'
- Floors listed by module name
- Locked floors shown but not selectable (future: unlock requirements)

## Phase Breakdown
This phase is broken into 6 tickets:

1. **Ticket 01**: Interaction System - Press E to enter/exit buildings
2. **Ticket 02**: Scene Transition - Switch between outdoor and interior scenes
3. **Ticket 03**: Static Lobby Floor - Build the ground floor that's always present
4. **Ticket 04**: Canvas API Mock - Create mock module data structure
5. **Ticket 05**: Dynamic Floor Generation - Create floors from module data
6. **Ticket 06**: Elevator System - Navigation between floors

## Dependencies
- Phase 1 must be complete (building collision and positioning)
- Canvas API integration will come later (use mock data for now)

## Estimated Time
8-10 hours total

## Notes
- Start with mock data, real Canvas API integration comes in Phase 3
- Lobby should be visually distinct (reception desk, entrance/exit door)
- Each module floor should have consistent layout for now
- Future phases will add module item interactions (assignments, pages, etc.)
- Consider transition animations (fade, door opening) for polish
