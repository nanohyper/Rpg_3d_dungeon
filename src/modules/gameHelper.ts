import { Direction } from "../defines/direction";

/**
 * ゲーム周りのヘルパー
 */
export class GameHelper {
    /**
     * 向きに対して、移動差分を求める
     * @param direction 向いている方向
     * @param move 進む方向
     */
    public static getMoveDelta(direction : number, move : number) {
        let delta = new Phaser.Math.Vector2();
        if(direction == Direction.left || direction == Direction.right) {
            if(move == Direction.left) {
                delta.y = 1;
            } else if(move == Direction.top) {
                delta.x = -1;
            } else if(move == Direction.right) {
                delta.y = -1;
            } else if(move == Direction.bottom) {
                delta.x = 1;
            }
            if(direction == Direction.right) {
                delta.x *= -1;
                delta.y *= -1;
            }
        } else {
            if(move == Direction.left) {
                delta.x = -1;
            } else if(move == Direction.top) {
                delta.y = -1;
            } else if(move == Direction.right) {
                delta.x = 1;
            } else if(move == Direction.bottom) {
                delta.y = 1;
            }
            if(direction == Direction.bottom) {
                delta.x *= -1;
                delta.y *= -1;
            }
        }
        return delta;
    }
}