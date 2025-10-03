import Phaser from 'phaser'
import gameConfig from './game'

window.addEventListener('load', () => {
  const game = new Phaser.Game(gameConfig)

  // Make game available globally for debugging
  ;(window as any).game = game
})
