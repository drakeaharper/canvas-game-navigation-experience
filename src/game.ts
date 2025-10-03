import Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene'
import GameScene from './scenes/GameScene'

const DEBUG_MODE = false // Set to true to see collision boxes

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL with Canvas fallback
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#87CEEB', // Sky blue
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Top-down game, no gravity
      debug: DEBUG_MODE
    }
  },
  scene: [PreloadScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 400,
      height: 300
    },
    max: {
      width: 1600,
      height: 1200
    }
  },
  pixelArt: true, // Crisp pixel art rendering
  render: {
    antialias: false
  }
}

export default gameConfig
