import Phaser from 'phaser'

export default class BoundaryEffect {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public showBoundaryHit(x: number, y: number, direction: 'top' | 'bottom' | 'left' | 'right') {
    // Create a small impact effect
    const particle = this.scene.add.circle(x, y, 4, 0xFFFFFF, 0.8)
    particle.setDepth(5)

    // Fade out and destroy
    this.scene.tweens.add({
      targets: particle,
      alpha: 0,
      scale: 2,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        particle.destroy()
      }
    })
  }
}
