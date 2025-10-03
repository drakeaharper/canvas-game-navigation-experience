# Canvas Course World

A 2D gamified navigation experience for Canvas LMS that transforms course navigation into an interactive old-timey town interface. Built with Phaser.js and TypeScript, designed to be integrated into Canvas via Module Federation.

## Overview

Canvas Course World reimagines the traditional LMS experience by creating an engaging 2D town where students explore buildings to access course features. Instead of clicking through menus, students walk through a virtual town square where the Assignment Hall, Discussion Tavern, Learning Library, and Grade House replace traditional Canvas navigation.

## Key Features

- **Interactive 2D Town Navigation**: Top-down exploration with arrow keys/WASD or click-to-move
- **Visual Progress Indicators**: Buildings change appearance based on student progress and activity
- **Real-time Canvas Integration**: Syncs with Canvas API for assignments, discussions, modules, and grades
- **Social Elements**: See other students as avatars moving around the town
- **Accessible Design**: Full keyboard navigation, screen reader support, and traditional list view fallback
- **Module Federation Ready**: Designed to be embedded into other Canvas applications

## Technology Stack

- **Game Engine**: Phaser.js (TypeScript)
- **UI Framework**: React (for overlays and menus)
- **Integration**: Canvas LMS API + LTI 1.3
- **Architecture**: Module Federation for seamless integration

## Project Structure

```
├── docs/
│   ├── planning/      # Game design and UX flow documentation
│   └── research/      # Technical research and integration approaches
└── src/               # Source code (to be created)
```

## Core Game Mechanics

### Buildings & Canvas Features

- **Assignment Hall** 🏛️ - View and access assignments with visual completion status
- **Discussion Tavern** 🍺 - Engage in course discussions with activity indicators
- **Learning Library** 📚 - Navigate course modules with progress visualization
- **Grade House** 📊 - Check grades and performance metrics
- **Collaboration Corner** - Group projects and team spaces
- **Resource Row** - Files, syllabus, and external tools

### Interaction System

1. Walk up to any building to see interaction prompts
2. Press E or click to open Canvas feature overlay
3. Complete tasks and return to the game world
4. Watch buildings update in real-time based on your progress

## Getting Started

*Development setup instructions coming soon*

## Documentation

- [Game Mechanics Design](./docs/planning/game-mechanics-design.md)
- [User Experience Flows](./docs/planning/user-experience-flows.md)
- [Technical Research](./docs/research/research-phase1-game-development.md)
- [Canvas Integration Details](./docs/research/canvas-integration-technical-details.md)

## Development Status

🚧 **Early Development** - Currently in planning and architecture phase

## Contributing

This project is part of Canvas LMS enhancement efforts. Contribution guidelines coming soon.

## License

*License information to be determined*
