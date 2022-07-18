export class MathHelper {
    /**
    * 乱数を得る
    * @param min 最小値
    * @param max 最大値(ただしこの値-1が実際の最大値)
    */
    public static getRandomInt(min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min));
    }
}