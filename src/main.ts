import 'phaser'
import Forest from './scenes/forest'

const config:GameConfig = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 640,
    height: 480,
    resolution: 1, 
    backgroundColor: "#EDEEC9",
    scene: [Forest],
    physics: {default: "matter"}
}

new Phaser.Game(config)
