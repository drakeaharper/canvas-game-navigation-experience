import Phaser from 'phaser'

export interface InputState {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

export default class InputManager {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd: {
    W: Phaser.Input.Keyboard.Key
    A: Phaser.Input.Keyboard.Key
    S: Phaser.Input.Keyboard.Key
    D: Phaser.Input.Keyboard.Key
  }

  constructor(scene: Phaser.Scene) {
    // Create cursor keys (arrow keys)
    this.cursors = scene.input.keyboard!.createCursorKeys()

    // Create WASD keys
    this.wasd = scene.input.keyboard!.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D
    }) as any
  }

  public getInputState(): InputState {
    return {
      up: this.cursors.up.isDown || this.wasd.W.isDown,
      down: this.cursors.down.isDown || this.wasd.S.isDown,
      left: this.cursors.left.isDown || this.wasd.A.isDown,
      right: this.cursors.right.isDown || this.wasd.D.isDown
    }
  }

  public isAnyKeyPressed(): boolean {
    const state = this.getInputState()
    return state.up || state.down || state.left || state.right
  }

  public getDirectionVector(): Phaser.Math.Vector2 {
    const state = this.getInputState()
    const vector = new Phaser.Math.Vector2(0, 0)

    if (state.left) vector.x = -1
    if (state.right) vector.x = 1
    if (state.up) vector.y = -1
    if (state.down) vector.y = 1

    // Normalize to prevent faster diagonal movement
    return vector.normalize()
  }

  public getDirection8Way(): string {
    const state = this.getInputState()

    // 8-directional movement
    if (state.up && state.right) return 'north-east'
    if (state.up && state.left) return 'north-west'
    if (state.down && state.right) return 'south-east'
    if (state.down && state.left) return 'south-west'
    if (state.up) return 'north'
    if (state.down) return 'south'
    if (state.left) return 'west'
    if (state.right) return 'east'

    return ''
  }
}
