import { MapChip } from "../defines/mapChip";
import { FloorData } from "../models/floorData";
import { MathHelper } from "./mathHelper";

export class MapCreator {
    /**
     * マップデータを生成する
     * @param floorData フロアデータ
     */
    public static create(floorData : FloorData) {
        console.log("迷路生成開始...");
        let width = floorData.width;
        let height = floorData.height;

        // x, yともにランダムの奇数の座標から穴掘りをスタートする
        let startx = MathHelper.getRandomInt(0, (width - 1) / 2) * 2 + 1;
        let starty = MathHelper.getRandomInt(0, (height - 1) / 2) * 2 + 1;

        // 開始点を通路にする
        floorData.setMapChip(startx, starty, MapChip.aisle);

        // 穴を掘り始める
        this.dig(floorData, startx, starty);

        console.log("迷路生成終了");
    }

    private static dig(floorData : FloorData, x : number, y : number, startPoints = []) {
        // 穴を掘る方法をランダムで決定する
        // ただし掘る方向の2マス先が
        // マップの範囲内 かつ 壁
        // の場合のみ掘ることができる
        const dig_directions = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        let diggable_dirs = [];
        for(let dir of dig_directions) {
            if(this.isDiggable(floorData, x, y, dir[0], dir[1])) {
                // 掘れる
                diggable_dirs.push(dir);
            }
        }

        if(diggable_dirs.length == 0) {
            // 掘れないので開始座標候補から開始座標を選ぶ
            if(startPoints.length == 0) {
                // 開始候補がないので終了
                return;
            }
            else {
                // 新しい開始地点をランダムで決定する
                let index = MathHelper.getRandomInt(0, startPoints.length);
                let startPoint = startPoints[index];
                // 選んだ開始地点は削除する
                startPoints.splice(index, 1);
                // 掘り始める
                this.dig(floorData, startPoint[0], startPoint[1], startPoints);
            }
        }
        else {
            // 掘る位置を開始座標候補に追加する
            startPoints.push([x, y]);
            // ランダムで掘る方向を決定する
            let index = MathHelper.getRandomInt(0, diggable_dirs.length);
            let dir = diggable_dirs[index];
            // 1マス先を通路にする
            floorData.setMapChip(x + dir[0], y + dir[1], MapChip.aisle);
            // 2マス先も通路にする
            floorData.setMapChip(x + dir[0] * 2, y + dir[1] * 2, MapChip.aisle);
            // 2マス先を新たな開始点にして掘る
            this.dig(floorData, x + dir[0] * 2, y + dir[1] * 2, startPoints);
        }
    }

    private static isDiggable(floorData : FloorData, x: number, y : number, dx : number, dy: number) {
        // 2マス先チェック
        let dstx = x + dx * 2;
        let dsty = y + dy * 2;
        // 迷路の範囲内 かつ 壁かチェック
        return 0 <= dstx && dstx < floorData.width &&
            0 <= dsty && dsty < floorData.height &&
            floorData.getMapChip(dstx, dsty) == MapChip.wall;
    }
}