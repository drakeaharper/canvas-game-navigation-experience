import Phaser from 'phaser'

export default class AnimationManager {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public createPlayerAnimations() {
    const directions = ['north', 'south', 'east', 'west']

    directions.forEach(direction => {
      // Create walk animation for each cardinal direction
      const frames: Phaser.Types.Animations.AnimationFrame[] = []

      for (let i = 0; i < 6; i++) {
        frames.push({
          key: `player-walk-${direction}-${i}`,
          frame: null
        })
      }

      this.scene.anims.create({
        key: `walk-${direction}`,
        frames: frames,
        frameRate: 10, // 10 frames per second for smooth walking
        repeat: -1 // Loop indefinitely
      })
    })
  }
}
