import { Scene } from "phaser";
import { Align } from "../defines/align";
import { Colors } from "../defines/colors";
import { Fonts } from "../defines/fonts";
import { FontSize } from "../defines/fontSize";
import { ExContainer } from "./exContainer";

export type ButtonConfig = {
    text? : string;
    textColor? : string;
    fontSize? : number;
    fontFamily? : string;
    fillColor? : number;
    strokeColor? : number;
    strokeWidth? : number;
    radius? : number;
    halign? : string;
    valign? : string;
    onClick? : () => void;
};

export class Button extends ExContainer {

    private _frame : Phaser.GameObjects.Graphics;
    private _onDownFilter : Phaser.GameObjects.Graphics;
    private _text : Phaser.GameObjects.Text;

    constructor(scene : Scene, x : number, y : number, width : number, height : number, config : ButtonConfig) {
        super(scene, x, y);

        const {
            text = "",
            textColor = Colors.Text.White,
            fontSize = FontSize.Default,
            fontFamily = Fonts.Default,
            fillColor = Colors.Numeric.Blue,
            strokeColor = Colors.Numeric.White,
            strokeWidth = 2,
            radius = 4,
            halign = Align.Center,
            valign = Align.Center,
            onClick = () => {}
        } = config;

        // 親シーンに自身を追加する
        this.scene.add.existing(this);
        // サイズセット
        this.setSize(width, height);
        // タップを受け取る
        // *判定位置の中心が左上になってしまうので補正する
        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(width / 2, height / 2, width, height),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            useHandCursor: true
        });

        // ボタンフレーム
        this._frame = this.scene.add.graphics();
        this._frame.fillStyle(fillColor).fillRoundedRect(0, 0, width, height, radius);
        this._frame.lineStyle(strokeWidth, strokeColor).strokeRoundedRect(0, 0, width, height, radius);
        this.add(this._frame);

        // 押下中を示す
        this._onDownFilter = this.scene.add.graphics();
        this._onDownFilter.fillStyle(0xffffff).fillRoundedRect(0, 0, width, height, radius);
        this._onDownFilter.setAlpha(0);
        this.add(this._onDownFilter);

        // テキスト
        let hAlignLeft = halign == Align.Start;
        let vAlignLeft = valign == Align.Start;
        this._text = this.scene.add.text(hAlignLeft ? 0 : width / 2, vAlignLeft ? 0 : height / 2, text)
            .setOrigin(hAlignLeft ? 0 : 0.5, vAlignLeft ? 0 : 0.5)
            .setFontFamily(fontFamily)
            .setColor(textColor)
            .setFontSize(fontSize);
        this.add(this._text);

        this.on('pointerdown', () => {
            // 押下状態表示
            this._onDownFilter.setAlpha(0.4);       
        })

        this.on('pointerdown', () => {
            // 押下状態表示
            this._onDownFilter.setAlpha(0.4);       
        })

        this.on('pointerout', () => {
            this._onDownFilter.setAlpha(0);
        });

        this.on("pointerup", () => {
            this,this._onDownFilter.setAlpha(0);
            console.log("click: " + text);
            onClick();
        });
    }
}