class Player extends Phaser.Physics.Matter.Sprite {
    text: Phaser.GameObjects.Text
    on_ground: boolean
    extra_jump: boolean
    readonly torque_force: number = 0.2
    readonly jump_force: number = -0.1
    readonly mass: number = 2
    readonly max_speed: number = 15
    readonly ground_friction: number = 10

    constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
        // Add to scene
        super(scene.matter.world, x, y, key, null, {shape: {type: 'circle'}})
        scene.sys.displayList.add(this)
        scene.sys.updateList.add(this)
        this.text = scene.add.text(0, 0, "")
        // Initializers
        this.on_ground = false
        // Callbacks
        scene.matter.world.on('collisionstart', this.floorCollisionCB.bind(this))
        scene.input.keyboard.on("keydown", this.jumpCB.bind(this))
        // Physics modifications
        this.setFriction(this.ground_friction)
        this.setBounce(1)
        this.setMass(this.mass)
    }

    floorCollisionCB(event, bodyA, bodyB) {
        const floor: any = this.world.walls['bottom']
        this.on_ground = floor == bodyA || floor == bodyB
        // Extra jump gained if collides with walls
        this.extra_jump = !this.on_ground
    }

    jumpCB(event) {
        const can_jump: boolean = (
            event.key == "ArrowUp" 
            && (this.isTouchingGround() || this.extra_jump)
        )
        if (can_jump) {
            this.applyForce(new Phaser.Math.Vector2(0, this.jump_force))
            this.on_ground = false
            this.extra_jump = !this.extra_jump
        }
    }

    getTorqueMultiplier(angularVelocity: number) {
        return Math.exp(-Math.abs(angularVelocity)) + 1
    }

    getVelocity() {
        return this.body.velocity
    }

    getAngularVelocity() {
        return this.body.angularVelocity
    }

    isTouchingGround() {
        return this.on_ground
    }

    updateText() {
        const x: number = Math.round(this.x)
        const y: number = Math.round(this.y)
        this.text.setText(`${x}; ${y}`)
        this.text.setPosition(x, y - 50)
    }

    movement(cursors: any) {
        const speed: number = Math.abs(this.getVelocity().x)
        // speed filter
        if (speed > this.max_speed) return
        const torqueMultiplier: number = this.getTorqueMultiplier(this.getAngularVelocity())
        if (cursors.left.isDown) {
            this.body.torque = -this.torque_force * torqueMultiplier
        }
        if (cursors.right.isDown) {
            this.body.torque = this.torque_force * torqueMultiplier
        }
    }

    step(cursors: any) {
        this.movement(cursors)
        this.updateText()
    }
}

export default Player