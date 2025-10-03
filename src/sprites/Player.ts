import Phaser from 'phaser'
import { GAME_CONFIG } from '../config/GameConfig'

export enum Direction {
  NORTH = 'north',
  NORTH_EAST = 'north-east',
  EAST = 'east',
  SOUTH_EAST = 'south-east',
  SOUTH = 'south',
  SOUTH_WEST = 'south-west',
  WEST = 'west',
  NORTH_WEST = 'north-west'
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private currentDirection: Direction = Direction.SOUTH
  private speed: number = GAME_CONFIG.player.speed
  private isMoving: boolean = false
  private lastBoundaryHitTime: number = 0
  private boundaryHitCooldown: number = 200 // ms

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-south')

    // Add to scene
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Configure physics body
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    body.setSize(32, 32) // Collision box smaller than sprite
    body.setOffset(16, 24) // Center the collision box
    body.setMaxVelocity(this.speed, this.speed)
    body.setDrag(GAME_CONFIG.player.drag, GAME_CONFIG.player.drag)

    // Set initial scale and properties
    this.setScale(1)
    this.setDepth(10) // Ensure player renders above ground
  }

  public getSpeed(): number {
    return this.speed
  }

  public getCurrentDirection(): Direction {
    return this.currentDirection
  }

  public setDirection(direction: Direction) {
    if (this.currentDirection !== direction) {
      const oldDirection = this.currentDirection
      this.currentDirection = direction

      // If moving, switch animation if the cardinal direction changed
      if (this.isMoving) {
        const oldAnimKey = this.getAnimationKeyForDirection(oldDirection)
        const newAnimKey = this.getAnimationKey()

        if (oldAnimKey !== newAnimKey && newAnimKey) {
          this.play(newAnimKey)
        }
      } else {
        this.updateStaticSprite()
      }
    }
  }

  private getAnimationKeyForDirection(direction: Direction): string | null {
    switch (direction) {
      case Direction.NORTH:
      case Direction.NORTH_EAST:
      case Direction.NORTH_WEST:
        return 'walk-north'

      case Direction.SOUTH:
      case Direction.SOUTH_EAST:
      case Direction.SOUTH_WEST:
        return 'walk-south'

      case Direction.EAST:
        return 'walk-east'

      case Direction.WEST:
        return 'walk-west'

      default:
        return null
    }
  }

  private updateStaticSprite() {
    // Use the 8-directional static rotation sprite when not moving
    this.setTexture(`player-${this.currentDirection}`)
  }

  public move(directionVector: Phaser.Math.Vector2, direction8Way: string) {
    const body = this.body as Phaser.Physics.Arcade.Body

    if (directionVector.length() === 0) {
      this.stop()
      return
    }

    const wasMoving = this.isMoving
    this.isMoving = true

    // Update facing direction
    if (direction8Way) {
      this.setDirection(direction8Way as Direction)
    }

    // Start walking animation if just started moving
    if (!wasMoving) {
      this.playWalkAnimation()
    }

    // Apply acceleration-based movement for smoother feel
    const accelX = directionVector.x * GAME_CONFIG.player.acceleration
    const accelY = directionVector.y * GAME_CONFIG.player.acceleration

    body.setAcceleration(accelX, accelY)
  }

  private playWalkAnimation() {
    const animKey = this.getAnimationKey()

    if (animKey && !this.anims.isPlaying) {
      this.play(animKey)
    }
  }

  private getAnimationKey(): string | null {
    // Map 8 directions to 4 cardinal animation directions
    switch (this.currentDirection) {
      case Direction.NORTH:
      case Direction.NORTH_EAST:
      case Direction.NORTH_WEST:
        return 'walk-north'

      case Direction.SOUTH:
      case Direction.SOUTH_EAST:
      case Direction.SOUTH_WEST:
        return 'walk-south'

      case Direction.EAST:
        return 'walk-east'

      case Direction.WEST:
        return 'walk-west'

      default:
        return null
    }
  }

  public stop() {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAcceleration(0, 0)

    // Only update sprite if we were moving
    if (this.isMoving) {
      this.isMoving = false
      this.stopWalkAnimation()
    }
  }

  private stopWalkAnimation() {
    this.anims.stop()
    this.updateStaticSprite()
  }

  public getVelocity(): Phaser.Math.Vector2 {
    const body = this.body as Phaser.Physics.Arcade.Body
    return new Phaser.Math.Vector2(body.velocity.x, body.velocity.y)
  }

  public getIsMoving(): boolean {
    return this.isMoving
  }

  public getPosition(): { x: number, y: number } {
    return { x: this.x, y: this.y }
  }

  public checkBoundaryCollision(worldBounds: Phaser.Geom.Rectangle, time: number): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body

    // Only check if enough time has passed since last hit
    if (time - this.lastBoundaryHitTime < this.boundaryHitCooldown) {
      return false
    }

    let hitBoundary = false

    if (body.blocked.up || body.blocked.down || body.blocked.left || body.blocked.right) {
      hitBoundary = true
      this.lastBoundaryHitTime = time
    }

    return hitBoundary
  }
}
