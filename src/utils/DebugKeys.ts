import Phaser from 'phaser'

export default class DebugKeys {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.setupKeys()
  }

  private setupKeys() {
    const keyboard = this.scene.input.keyboard!

    // F key - toggle fullscreen
    keyboard.on('keydown-F', () => {
      if (this.scene.scale.isFullscreen) {
        this.scene.scale.stopFullscreen()
      } else {
        this.scene.scale.startFullscreen()
      }
    })

    // R key - restart scene
    keyboard.on('keydown-R', () => {
      this.scene.scene.restart()
    })

    // P key - pause/resume
    keyboard.on('keydown-P', () => {
      if (this.scene.scene.isPaused()) {
        this.scene.scene.resume()
      } else {
        this.scene.scene.pause()
      }
    })
  }
}
