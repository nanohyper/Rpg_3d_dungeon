import { FloorData } from "../models/floorData";
import { Player } from "../models/player";

/**
 * プレイヤーを保持する
 */
export class PlayerManager {
    private static _instance : PlayerManager | null = null;
    public static get instance() {
        if(this._instance == null) {
            this._instance = new PlayerManager();
        }
        return this._instance;
    }

    public player : Player;
    public floorData : FloorData;
}