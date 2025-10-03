# Phase 1: Base Layout - Town Map with Building Placement

## Goal
Create a horizontal town layout with 4 primary buildings connected by roads, implementing a camera system that keeps the player centered until they reach map boundaries.

## Success Criteria
- [ ] Expanded game world (larger than viewport)
- [ ] Camera follows player and keeps them centered
- [ ] Camera stops at world boundaries (player can move to edges)
- [ ] 4 buildings placed horizontally with roads connecting them
- [ ] Buildings are interactive (collision detection)
- [ ] Road/path system connecting all buildings
- [ ] Smooth camera movement
- [ ] Player can navigate entire town

## Camera System Behavior

### Center-Locked Camera (Default)
- Player stays in center of screen
- World scrolls around player as they move
- Applies when player is away from world edges

### Edge-Bounded Camera
- Camera stops scrolling at world boundaries
- Player can move within viewport to reach edges
- Prevents showing area outside world bounds

## World Layout Design

```
Horizontal Town Layout (Expanded World)

Total World Size: 2400px wide × 800px tall
Viewport: 800px × 600px

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  West Side              Town Center           East Side         │
│                                                                 │
│  🏛️ City Hall      🎭 Social Hall      📚 Library    📊 Accounting│
│  (Assignments)     (Discussions)       (Modules)     (Grades)   │
│                                                                 │
│      │                   │                 │            │       │
│      └───────────────────┴─────────────────┴────────────┘       │
│                    Main Street (Road)                           │
│                                                                 │
│                    @ Player Start (Center)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Building Positions (Approximate)
- **City Hall**: x: 400, y: 300
- **Social Hall**: x: 900, y: 300
- **University Library**: x: 1400, y: 300
- **Accounting House**: x: 1900, y: 300
- **Player Start**: x: 1200, y: 500 (centered in world)

## Technical Requirements

### Camera Implementation
- Use Phaser's built-in camera bounds
- Enable camera follow with lerp smoothing
- Set world bounds to total world size
- Camera follows player with smooth interpolation

### Tilemap/Road System
- Create road tiles connecting buildings
- Use procedural generation or manual placement
- Road should be visually distinct from grass

### Building Integration
- Load building sprites as static images
- Add physics bodies for collision
- Position buildings along main street
- Ensure buildings face south (toward player approach)

## Out of Scope for Phase 1
- Building interactions (enter/exit)
- UI overlays for buildings
- Multiple NPCs
- Detailed decorations
- Building state indicators
- Animated building elements

## Tickets Breakdown
1. **Ticket 01**: Expand world size and update camera bounds
2. **Ticket 02**: Implement center-locked camera system
3. **Ticket 03**: Create road/path tileset
4. **Ticket 04**: Place buildings in horizontal layout
5. **Ticket 05**: Add building collision
6. **Ticket 06**: Test and polish camera boundaries

## Estimated Timeline
- **Total Development Time**: 3-4 hours
- **Each Ticket**: 30-45 minutes
