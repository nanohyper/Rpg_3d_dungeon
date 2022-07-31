import { Direction } from "../defines/direction";

export class Player {
    // 位置
    public x : number;
    public y : number;
    // 向き
    public direction : number = Direction.top;
}