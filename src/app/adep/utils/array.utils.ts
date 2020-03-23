export class ArrayUtils {
    public static clear(target: any[]) {
        target.splice(0, target.length);
    }

    public static push(target: any[], elements: any[]) {
        Array.prototype.push.apply(target, elements);
    }

    public static replace(target: any[], elements: any[]) {
        ArrayUtils.clear(target);
        ArrayUtils.push(target, elements);
    }
}
