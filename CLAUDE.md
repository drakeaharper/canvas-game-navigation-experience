# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Canvas Course World is a 2D gamified navigation experience for Canvas LMS that transforms traditional course navigation into an interactive old-timey town interface. Students explore buildings (Assignment Hall, Discussion Tavern, Learning Library, Grade House) instead of clicking through menus.

**Key Goal**: Build as a Module Federation component that can be embedded into Canvas LMS applications.

## Technology Stack

- **Game Engine**: Phaser.js (TypeScript)
- **UI Layer**: React (for overlays, menus, and HUD)
- **Integration**: Canvas LMS API + LTI 1.3
- **Architecture**: Module Federation for embedding into Canvas

## Project Architecture

### Design Philosophy

The architecture separates concerns between game logic and UI:
- **Phaser.js** handles game rendering, physics, input, and core game loop
- **React** manages UI components (modals, overlays, progress displays)
- **Canvas API Client** syncs real-time data (assignments, discussions, modules, grades)
- **LTI 1.3** provides authentication and grade passback

### State Management Strategy

Games require **non-reactive state** (opposite of React patterns):
- Use closures, class instances, or module scope for game state
- React state should only be used for UI components
- Game state updates happen in the game loop, not via React re-renders

### Integration Approaches (Options Under Consideration)

1. **Internal Canvas Feature**: Built directly into Canvas codebase
   - Lives in `ui/features/games/` with React components
   - Uses Canvas GraphQL API and existing infrastructure

2. **Canvas Plugin**: Modular gem in `gems/plugins/canvas_games/`
   - More isolated but still leverages Canvas infrastructure

3. **External LTI Application**: Separate deployment
   - Communicates via LTI and Canvas API
   - Requires separate infrastructure

**Module Federation**: Regardless of approach, must be consumable as a federated module.

## Canvas LMS Integration Points

### API Endpoints for Game Data
```javascript
GET /api/v1/courses/:course_id/assignments     // Assignment Hall data
GET /api/v1/courses/:course_id/discussion_topics // Discussion Tavern activity
GET /api/v1/courses/:course_id/modules         // Learning Library progress
GET /api/v1/courses/:course_id/users           // Social elements (other players)
```

### Visual Indicators Map to API Data
- Building appearance changes based on Canvas data
- Assignment Hall: completion status → green checkmarks/red flags
- Discussion Tavern: activity level → crowd noise/lights
- Learning Library: module progress → lit windows/locked sections
- Grade House: recent grades → decorations/indicators

### LTI 1.3 Requirements
- HTTPS deployment mandatory
- Developer Key configuration in Canvas
- JSON configuration block or hosted config URL
- Proper signature validation for security

## Key Design Documents

All planning documents are in `docs/planning/` and `docs/research/`:

- **docs/planning/game-mechanics-design.md**: Complete building system, interaction mechanics, navigation
- **docs/planning/user-experience-flows.md**: Student/teacher workflows, accessibility features
- **docs/research/research-phase1-game-development.md**: Phaser.js selection rationale, React integration strategy
- **docs/research/canvas-integration-technical-details.md**: LTI setup, API patterns, security considerations

## Core Game Mechanics

### Building Interaction Flow
1. Character walks near building → interaction prompt appears
2. Building shows visual indicators (badges, colors, activity)
3. Press E or click → Canvas feature overlay/modal opens
4. Complete task → return to world → building updates in real-time

### Buildings Map to Canvas Features
- **Assignment Hall** 🏛️ → Assignments
- **Discussion Tavern** 🍺 → Discussions
- **Learning Library** 📚 → Modules
- **Grade House** 📊 → Grades
- **Collaboration Corner** → Groups/People
- **Resource Row** → Files/Syllabus/External Tools

### Social Elements
- Other students appear as avatars in the town
- Real-time multiplayer presence
- Collaborative spaces for group work

## Security & Performance Considerations

### Security
- Client-side game state must be validated server-side
- Prevent score manipulation and cheating
- Proper API token scoping and rate limiting
- LTI signature validation

### Performance
- Cache Canvas API responses appropriately
- Asset optimization and lazy loading
- Memory management for long game sessions
- Consider Canvas database sharding (Switchman) if storing game data

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production
npm run preview    # Preview production build
```

## Git Workflow

**IMPORTANT**: Only create commits and push to remote with explicit user approval. Never commit or push automatically.

When user requests a commit:
1. Run `git status` and `git diff` to review changes
2. Stage relevant files with `git add`
3. Create commit with descriptive message including co-author tag
4. Only push if explicitly requested

## Development Status

✅ **MVP Complete**: Basic walking in grassy field implemented (see `project_phases/MVP/`)

### Implemented Features
- Phaser 3 game engine with TypeScript
- 8-directional character movement with WASD/Arrow keys
- Walk animations (4 directions, 6 frames each)
- Collision boundaries with visual borders
- FPS counter and debug UI
- Loading screen with progress bar
- Debug shortcuts (F=fullscreen, R=restart, P=pause)

### Next Steps
1. Module Federation configuration
2. Canvas API client integration
3. Building interaction system
4. First building implementation (Assignment Hall)
