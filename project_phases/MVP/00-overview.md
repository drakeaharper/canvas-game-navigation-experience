# MVP Overview - Walking in a Grassy Field

## Goal
Create a minimal playable demo where a player character can walk around a grassy field using keyboard controls, demonstrating the core movement mechanics that will be used in the full Canvas Course World game.

## Success Criteria
- [ ] Player can see a grassy field background
- [ ] Player character sprite renders on screen
- [ ] Character moves in 8 directions (N, NE, E, SE, S, SW, W, NW) using arrow keys or WASD
- [ ] Walk animations play correctly for all 4 cardinal directions
- [ ] Character rotation updates to match movement direction
- [ ] Smooth movement with proper collision boundaries (stay within field)
- [ ] Game runs at 60 FPS in modern browsers

## Out of Scope for MVP
- Canvas LMS integration
- Building interactions
- Multiple players/multiplayer
- UI overlays or menus
- Sound effects or music
- Module Federation setup
- Save/load state

## Technical Stack
- **Game Engine**: Phaser 3 (latest stable)
- **Language**: TypeScript
- **Build Tool**: Vite (fast dev server, simple setup)
- **Package Manager**: npm

## Assets Available
- Character sprite: 64x64px school boy
- 8 directional rotation sprites (N, NE, E, SE, S, SW, W, NW)
- 4 directional walk animations (N, S, E, W) - 6 frames each
- Location: `initial-assets/basic_school_boy_with_a_hat_and_black_hair_in_the_style_of_pokemon_fire_red/`

## Tickets Breakdown
1. **Ticket 01**: Project setup and configuration
2. **Ticket 02**: Create grass field scene
3. **Ticket 03**: Load and configure player sprite
4. **Ticket 04**: Implement keyboard input handling
5. **Ticket 05**: Implement 8-directional movement
6. **Ticket 06**: Add walk animations
7. **Ticket 07**: Add collision boundaries
8. **Ticket 08**: Polish and testing

## Estimated Timeline
- **Total Development Time**: 1-2 days for experienced developer
- **Each Ticket**: 30 minutes - 2 hours depending on complexity
