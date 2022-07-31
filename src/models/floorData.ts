import { Direction } from "../defines/direction";
import { MapChip } from "../defines/mapChip";
import { Strings } from "../defines/strings";
import { GameHelper } from "../modules/gameHelper";

export class FloorData {
    // 大きさ
    public width : number;
    public height : number;
    // マップ情報
    public mapData : number[];
    // 踏破情報
    public traversedData : number[];

    constructor(width : number, height : number) {
        this.width = width;
        this.height = height;
        this.mapData = [];
        this.traversedData = [];
        // マップすべてのマップチップを壁で初期化
        // 踏破情報を0で初期化
        for(let i = 0; i < width * height; ++i) {
            this.mapData.push(MapChip.wall);
            this.traversedData.push(0);
        }
    }

    /**
     * マップの範囲内か？
     * @param x
     * @param y 
     */
    public isInside(x : number, y : number) {
        return 0 <= x && x < this.width && 0 <= y && y < this.height;
    }

    /**
     * マップの範囲外か？
     * @param x 
     * @param y 
     * @returns 
     */
    public isOutside(x : number, y : number) {
        return !this.isInside(x, y);
    }

    /**
     * マップチップを得る
     * @param x 
     * @param y 
     * @param outsideMapChip マップ範囲外のときこのマップチップで扱う
     * @returns 
     */
    public getMapChip(x : number, y : number, outsideMapChip = MapChip.wall) {
        if(this.isOutside(x, y)) return outsideMapChip
        return this.mapData[y * this.width + x];
    }

    /**
     * マップチップをセットする
     * @param x 
     * @param y 
     * @param mapChip 
     */
    public setMapChip(x : number, y : number, mapChip : number) {
        this.mapData[y * this.width + x] = mapChip;
    }

    /**
     * この位置に進むことができるか？
     * @param x 
     * @param y 
     */
    public canStep(x : number, y : number) {
        if(this.isInside(x, y)) {
            let mapChip = this.getMapChip(x, y);
            if(mapChip == MapChip.wall) {
                // 壁
                return false;
            } else {
                return true;
            }
        } else {
            // 領域外
            return false;
        }
    }

    /**
     * 踏破済みか？
     * @param x 
     * @param y 
     */
    public isTraversed(x : number, y : number) {
        if(this.isInside(x, y)) {
            return this.traversedData[y * this.width + x] == 1;
        } else {
            // 領域外
            return false;
        }
    }

    /**
     * 踏破済みにする
     * @param x 
     * @param y 
     */
    public setTraversed(x : number, y : number) {
        if(this.isInside(x, y)) {
            this.traversedData[y * this.width + x] = 1;
        }
    }

    /**
     * 指定の場所とその周囲を踏破済みにする
     * @param x 
     * @param y 
     * @param direction
     */
    public setTraversedAround(x : number, y : number, direction : number) {
        let tx = x;
        let ty = y;
        this.setTraversed(tx, ty);
        // 左
        let dLeft = GameHelper.getMoveDelta(direction, Direction.left);
        tx = x + dLeft.x;
        ty = y + dLeft.y;
        this.setTraversed(tx, ty);
        // 右
        let dRight = GameHelper.getMoveDelta(direction, Direction.right);
        tx = x + dRight.x;
        ty = y + dRight.y;
        this.setTraversed(tx, ty);
        // 上
        let dTop = GameHelper.getMoveDelta(direction, Direction.top);
        tx = x + dTop.x;
        ty = y + dTop.y;
        this.setTraversed(tx, ty);
        // 左上
        tx = x + dTop.x + dLeft.x;
        ty = y + dTop.y + dLeft.y;
        this.setTraversed(tx, ty);
        // 右上
        tx = x + dTop.x + dRight.x;
        ty = y + dTop.y + dRight.y;
        this.setTraversed(tx, ty);
    }

    /**
     * マップデータをコンソールに出力する
     */
    public traceMapData() {
        let text = "";
        for(let y = 0; y < this.height; ++y) {
            for(let x = 0; x < this.width; ++x) {
                let mapChip = this.getMapChip(x, y);
                if(mapChip == MapChip.wall) {
                    text += "■";
                } else {
                    text += "□";
                }
            }
            text += Strings.Newline;
        }
        console.log(text);
    }
}