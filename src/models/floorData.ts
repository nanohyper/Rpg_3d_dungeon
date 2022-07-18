import { MapChip } from "../defines/mapChip";
import { Strings } from "../defines/strings";

export class FloorData {
    public width : number;
    public height : number;
    public mapData : number[];

    constructor(width : number, height : number) {
        this.width = width;
        this.height = height;
        this.mapData = [];
        // マップすべてのマップチップを壁で初期化
        for(let i = 0; i < width * height; ++i) {
            this.mapData.push(MapChip.wall);
        }
    }

    /**
     * マップチップを得る
     * @param x 
     * @param y 
     * @returns 
     */
    public getMapChip(x : number, y : number) {
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
        if(0 <= x && x < this.width && 0 <= y && y < this.height) {
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