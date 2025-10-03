export const GAME_CONFIG = {
  world: {
    width: 2400,  // Expanded from 800
    height: 800,  // Expanded from 600
  },
  viewport: {
    width: 800,
    height: 600
  },
  player: {
    speed: 120,
    acceleration: 600,
    drag: 400,
    startX: 1200, // Center of world
    startY: 550   // On the main road
  },
  camera: {
    lerp: 0.08,  // Slightly smoother for larger world
    deadzone: {
      width: 0,   // No deadzone - player stays centered
      height: 0
    }
  },
  buildings: {
    cityHall: { x: 400, y: 534, width: 128, height: 128 },      // GOOD - aligned
    socialHall: { x: 900, y: 507, width: 128, height: 128 },    // GOOD - don't change
    library: { x: 1500, y: 495, width: 128, height: 128 },      // Moved down 5px
    accountingHouse: { x: 2000, y: 491, width: 128, height: 128 }  // Moved down to 500
  },
  roads: {
    mainStreetY: 500
  }
}
