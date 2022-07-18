import { Scene } from "phaser";

/**
 * 子のupdate()を呼ぶようにしたコンテナの拡張クラス
 */
export class ExContainer extends Phaser.GameObjects.Container {
    update() {
        for(let child of this.getAll()) {
            if(child instanceof Phaser.GameObjects.Container) {
                child.update();
            }
        }
    }
}