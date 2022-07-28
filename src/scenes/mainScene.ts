import { Direction } from "../defines/direction";
import { PlayerManager } from "../managers/playerManager";
import { FloorData } from "../models/floorData";
import { Player } from "../models/player";
import { GameHelper } from "../modules/gameHelper";
import { MapCreator } from "../modules/mapCreator";
import { MiniMap } from "../ui/miniMap";
import { ThreedMap } from "../ui/threedMap";

export default class MainScene extends Phaser.Scene
{
    // 3Dマップ
    threedMap : ThreedMap;
    // ミニマップ
    miniMap : MiniMap;

    // カーソルキー
    cursorKey : Phaser.Types.Input.Keyboard.CursorKeys;

    // プレイヤー

    constructor() {
        super({
            key: 'MainScene'
        })
    };

    preload(): void {
        console.log("preload.")
    }

    create() : void {
        console.log("create");

        // 迷路を自動生成する
        let floorData = new FloorData(17, 17);
        MapCreator.create(floorData);
        floorData.traceMapData();
        PlayerManager.instance.floorData = floorData;

        // プレイヤー初期化
        let player = new Player();
        player.x = 1;
        player.y = 1;
        PlayerManager.instance.player = player;

        // 3Dマップ
        this.threedMap = new ThreedMap(this, 0, 0, this.game.canvas.width, this.game.canvas.width, player, floorData);
        this.add.group(this.threedMap, { runChildUpdate: true });

        // ミニマップ
        this.miniMap = new MiniMap(this, this.game.canvas.width - 120, 0, 120, 120, player, floorData);
        this.add.group(this.miniMap, { runChildUpdate: true });

        // カーソルキー
        this.cursorKey = this.input.keyboard.createCursorKeys();
    }
    
    update() {
        if(this.cursorKey.left.isDown) {
            this.turnLeft();
            this.cursorKey.left.reset();
        } else if(this.cursorKey.right.isDown) {
            this.turnRight();
            this.cursorKey.right.reset();
        } else if(this.cursorKey.up.isDown) {
            this.goForward();
            this.cursorKey.up.reset();
        } else if(this.cursorKey.down.isDown) {
            this.goBack();
            this.cursorKey.down.reset();
        }
    }

    /**
     * 左旋回
     */
    turnLeft() {
        let player = PlayerManager.instance.player;
        player.direction = (player.direction + 4 - 1) % 4;
        // 3Dマップ更新
        this.threedMap.refresh();
        // ミニマップ更新
        this.miniMap.refresh();
    }

    /**
     * 右旋回
     */
    turnRight() {
        let player = PlayerManager.instance.player;
        player.direction = (player.direction + 1) % 4;
        // 3Dマップ更新
        this.threedMap.refresh();
        // ミニマップ更新
        this.miniMap.refresh();
    }

    /**
     * 前に進む
     */
    goForward() {
        let player = PlayerManager.instance.player;
        let floorData = PlayerManager.instance.floorData;
        let delta = GameHelper.getMoveDelta(player.direction, Direction.top);
        let newx = player.x + delta.x;
        let newy = player.y + delta.y;
        if(floorData.canStep(newx, newy)) {
            player.x = newx;
            player.y = newy;
            // 3Dマップ更新
            this.threedMap.refresh();
            // ミニマップ更新
            this.miniMap.refresh();;
        }
    }

    /**
     * 後ろに戻る
     */
    goBack() {
        let player = PlayerManager.instance.player;
        let floorData = PlayerManager.instance.floorData;
        const deltaPoints = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        let newx = player.x - deltaPoints[player.direction][0];
        let newy = player.y - deltaPoints[player.direction][1];
        if(floorData.canStep(newx, newy)) {
            player.x = newx;
            player.y = newy;
            // 3Dマップ更新
            this.threedMap.refresh();
            // ミニマップ更新
            this.miniMap.refresh();
        }
    }
}