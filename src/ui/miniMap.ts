import { Scene } from "phaser";
import { Colors } from "../defines/colors";
import { Direction } from "../defines/direction";
import { MapChip } from "../defines/mapChip";
import { FloorData } from "../models/floorData";
import { Player } from "../models/player";
import { ExContainer } from "./exContainer";

export class MiniMap extends ExContainer{

    // タイルを並べる数
    static readonly HORIZONTAL_TILES_NUMBER = 9;
    static readonly VERTICAL_TILES_NUMBER = 9;

    private _graphics : Phaser.GameObjects.Graphics;

    public player : Player
    public floorData : FloorData;

    constructor(scene : Scene, x : number, y : number, width : number, height : number, player : Player, floorData : FloorData) {
        super(scene, x, y);

        // シーンに自身を追加する
        this.scene.add.existing(this);
        // サイズセット
        this.setSize(width, height);

        this._graphics = this.scene.add.graphics();
        this.add(this._graphics);

        this.player = player;
        this.floorData = floorData;

        this.refresh();
    }

    /**
     * 更新する
     * 処理コストを下げるため、update()ではなく外部から呼ぶ
     */
    public refresh() {
        // グラフィックをクリア
        this._graphics.clear();

        // タイル１つのサイズ
        let tileWidth = this.width / MiniMap.HORIZONTAL_TILES_NUMBER;
        let tileHeight = this.height / MiniMap.VERTICAL_TILES_NUMBER;

        // 左上のマップチップ座標
        let startx = this.player.x - (MiniMap.HORIZONTAL_TILES_NUMBER - 1) / 2;
        let starty = this.player.y - (MiniMap.VERTICAL_TILES_NUMBER - 1) / 2;

        for(let dy = 0; dy < MiniMap.VERTICAL_TILES_NUMBER; ++dy) {
            let y = starty + dy;
            for(let dx = 0; dx < MiniMap.HORIZONTAL_TILES_NUMBER; ++dx) {
                let x = startx + dx;
                let color = 0;
                if(0 <= x && x < this.floorData.width &&
                    0 <= y && y < this.floorData.height) {
                    // マップチップを取得
                    let mapChip = this.floorData.getMapChip(x, y);
                    if(mapChip == MapChip.wall) {
                        color = Colors.Numeric.DarkBlue;
                    } else if(mapChip == MapChip.aisle) {
                        color = Colors.Numeric.LightBlue;
                    }
                } else {
                    // 領域外
                    color = Colors.Numeric.DarkBlue;
                }
                // タイル描画
                let tilex = dx * tileWidth;
                let tiley = dy * tileHeight;
                this._graphics.fillStyle(color, 1).fillRect(tilex, tiley, tileWidth, tileHeight);
            }
        }

        // 中央に向きマーカー表示
        let triPoints = [];
        if(this.player.direction == Direction.left) {
            triPoints.push([this.width / 2 - tileWidth / 2, this.height / 2]);
            triPoints.push([this.width / 2 + tileWidth / 2, this.height / 2 - tileHeight / 2]);
            triPoints.push([this.width / 2 + tileWidth / 2, this.height / 2 + tileHeight / 2]);
        } else if(this.player.direction == Direction.top) {
            triPoints.push([this.width / 2, this.height / 2 - tileHeight / 2]);
            triPoints.push([this.width / 2 - tileWidth / 2, this.height / 2 + tileHeight / 2]);
            triPoints.push([this.width / 2 + tileWidth / 2, this.height / 2 + tileHeight / 2]);
        } else if(this.player.direction == Direction.right) {
            triPoints.push([this.width / 2 + tileWidth / 2, this.height / 2]);
            triPoints.push([this.width / 2 - tileWidth / 2, this.height / 2 + tileHeight / 2]);
            triPoints.push([this.width / 2 - tileWidth / 2, this.height / 2 - tileHeight / 2]);
        } else {
            triPoints.push([this.width / 2, this.height / 2 + tileHeight / 2]);
            triPoints.push([this.width / 2 - tileWidth / 2, this.height / 2 - tileHeight / 2]);
            triPoints.push([this.width / 2 + tileWidth / 2, this.height / 2 - tileHeight / 2]);
        }
        this._graphics.fillStyle(Colors.Numeric.Red, 0.7).fillTriangle(
            triPoints[0][0], triPoints[0][1], triPoints[1][0], triPoints[1][1],
            triPoints[2][0], triPoints[2][1]);
    }
}