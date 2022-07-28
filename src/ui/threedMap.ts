import { Scene } from "phaser";
import { Colors } from "../defines/colors";
import { Direction } from "../defines/direction";
import { MapChip } from "../defines/mapChip";
import { FloorData } from "../models/floorData";
import { Player } from "../models/player";
import { GameHelper } from "../modules/gameHelper";
import { ExContainer } from "./exContainer";

export class ThreedMap extends ExContainer {

    // マップ中央から、今いる場所の床までの距離
    // 1のとき画面端
    static readonly CENTER_TO_CURRENT_TILE = 0.8;
    // いくつ先まで描画するか
    static readonly FORWARD_TILES_NUMBER = 4;

    private _graphics : Phaser.GameObjects.Graphics;

    public player : Player;
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
        this._graphics.lineStyle(2, Colors.Numeric.White, 1);

        // 調べる基準点
        let basePoint = new Phaser.Math.Vector2(this.player.x, this.player.y);
         // 描画する左上の斜め線始点
        let drawBegin = new Phaser.Math.Vector2(0, 0);
        // 描画する左上の斜め線終点
        let temp = this.width / 2 - this.width / 2 * ThreedMap.CENTER_TO_CURRENT_TILE;
        let drawEnd = new Phaser.Math.Vector2(temp, temp);
        for(let i = 0; i <= ThreedMap.FORWARD_TILES_NUMBER; ++i) {
            // 一つ左を調べる
            let left = basePoint.clone().add(GameHelper.getMoveDelta(this.player.direction, Direction.left));
            let leftMapChip = this.floorData.getMapChip(left.x, left.y);
            if(leftMapChip == MapChip.wall) {
                // 壁
                this._graphics.beginPath();
                this._graphics.moveTo(drawBegin.x, drawBegin.y);
                this._graphics.lineTo(drawEnd.x, drawEnd.y);
                this._graphics.moveTo(drawBegin.x, this.height - drawBegin.y);
                this._graphics.lineTo(drawEnd.x, this.height - drawEnd.y);
                this._graphics.strokePath();
            } else {
                // 壁以外
                this._graphics.beginPath();
                this._graphics.moveTo(drawBegin.x, drawEnd.x);
                this._graphics.lineTo(drawEnd.x, drawEnd.y);
                this._graphics.moveTo(drawBegin.x, this.height - drawEnd.x);
                this._graphics.lineTo(drawEnd.x, this.height - drawEnd.y);
                this._graphics.strokePath();
            }

            // 一つ右を調べる
            let right = basePoint.clone().add(GameHelper.getMoveDelta(this.player.direction, Direction.right));
            let rightMapChip = this.floorData.getMapChip(right.x, right.y);
            if(rightMapChip == MapChip.wall) {
                // 壁
                this._graphics.beginPath();
                this._graphics.moveTo(this.width - drawBegin.x, drawBegin.y);
                this._graphics.lineTo(this.width - drawEnd.x, drawEnd.y);
                this._graphics.moveTo(this.width - drawBegin.x, this.height - drawBegin.y);
                this._graphics.lineTo(this.width - drawEnd.x, this.height - drawEnd.y);
                this._graphics.strokePath();
            } else {
                // 壁以外
                this._graphics.beginPath();
                this._graphics.moveTo(this.width - drawBegin.x, drawEnd.x);
                this._graphics.lineTo(this.width - drawEnd.x, drawEnd.y);
                this._graphics.moveTo(this.width - drawBegin.x, this.height - drawEnd.x);
                this._graphics.lineTo(this.width - drawEnd.x, this.height - drawEnd.y);
                this._graphics.strokePath();
            }
            
            // 縦線
            this._graphics.beginPath();
            this._graphics.moveTo(drawEnd.x, drawEnd.y);
            this._graphics.lineTo(drawEnd.x, this.height - drawEnd.y);
            this._graphics.moveTo(this.width - drawEnd.x, drawEnd.y);
            this._graphics.lineTo(this.width - drawEnd.x, this.height - drawEnd.y);
            this._graphics.strokePath();
            
            // 前の壁をチェック
            let forward = basePoint.clone().add(GameHelper.getMoveDelta(this.player.direction, Direction.top));
            let forwardMapChip = this.floorData.getMapChip(forward.x, forward.y);
            if(forwardMapChip == MapChip.wall) {
                this._graphics.beginPath();
                this._graphics.moveTo(drawEnd.x, drawEnd.y);
                this._graphics.lineTo(this.width - drawEnd.x, drawEnd.y);
                this._graphics.lineTo(this.width - drawEnd.x, this.height - drawEnd.y);
                this._graphics.lineTo(drawEnd.x, this.height - drawEnd.y);
                this._graphics.closePath();
                this._graphics.strokePath();
                
                // これ以上は奥を描画しない
                break;
            }

            // 奥に進む
            basePoint.add(GameHelper.getMoveDelta(this.player.direction, Direction.top));
            // 描画点の移動
            drawBegin = drawEnd;
            temp = (this.width / 2 * ThreedMap.CENTER_TO_CURRENT_TILE * (1 / (i + 1) - 1 / (i + 2)));
            drawEnd = drawEnd.clone().add(new Phaser.Math.Vector2(temp, temp));
        }
    }
}