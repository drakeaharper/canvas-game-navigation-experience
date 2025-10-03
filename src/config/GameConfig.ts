export const GAME_CONFIG = {
  world: {
    width: 800,
    height: 600
  },
  player: {
    speed: 120, // pixels per second
    acceleration: 600, // faster acceleration for snappy controls
    drag: 400 // drag when stopping
  },
  camera: {
    lerp: 0.1 // smooth camera follow
  }
}
