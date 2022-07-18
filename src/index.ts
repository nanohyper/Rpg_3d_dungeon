import 'phaser';
import MainScene from './scenes/mainScene';

const config: Phaser.Types.Core.GameConfig = {
    width: 360,
    height: 640,
    type: Phaser.AUTO,
    parent: 'game',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game'
    },
    scene: [ MainScene ]
};

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.addEventListener('load', () => {
    const game = new Game(config);
});