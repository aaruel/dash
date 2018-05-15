import Player from "./player"

export interface GameMapOptions {
    // Z-order back to front
    backgroundImages: string[]
    mainImage: string
    playerImage: string
}

// Default overridable map
export class GameMap extends Phaser.Scene {
    player: Player
    cursors: any
    options: GameMapOptions
    readonly gravity: number = 2

    constructor(options: GameMapOptions) {
        super({key: 'MapScene'})
        this.options = options
    }
    
    getImageDimensions(key: string) {
        const image = this.textures.get(key).getSourceImage()
        return {x: image.width, y: image.height}
    }

    addImages() {
        const numBackgrounds: number = this.options.backgroundImages.length
        for (let i = 0; i < numBackgrounds; ++i) {
            let background = this.add.image(0, 0, `backgroundImage_${i}`)
            background.setOrigin(0)
            background.setScrollFactor((1 + i) / numBackgrounds)
        }
        let main = this.add.image(0, 0, 'mainImage')
        main.setOrigin(0)
    }
    
    preload() {
        for (let i = 0; i < this.options.backgroundImages.length; ++i) {
            this.load.image(`backgroundImage_${i}`, this.options.backgroundImages[i])
        }
        this.load.image('mainImage', this.options.mainImage)
        this.load.image('playerImage', this.options.playerImage)
    }

    create() {
        this.addImages()

        this.player = new Player(this, 100, 100, 'playerImage')
        this.cursors = this.input.keyboard.createCursorKeys()

        const backgroundDimensions = this.getImageDimensions('mainImage')
        this.cameras.main.setBounds(0, 0, backgroundDimensions.x, backgroundDimensions.y)
        this.cameras.main.startFollow(this.player, false)
        
        this.matter.world.setBounds(0, 0, backgroundDimensions.x, backgroundDimensions.y)
        this.matter.world.setGravity(0, this.gravity)
    }

    update(time: number, delta: number) {
        this.player.step(this.cursors)
    }
}