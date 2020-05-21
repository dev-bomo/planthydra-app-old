export default class TimeUtils {
    public static prepend0(time: number): string {
        return ("0" + time).slice(-2)
    }
}