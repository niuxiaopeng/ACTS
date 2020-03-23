import 'reflect-metadata';

export class ObjectUtils {
    public static isPrimitive(target: any): boolean {
        if (typeof target === 'string' || typeof target === 'number' ||
            typeof target === 'boolean') {
            return true;
        }
        return (target instanceof String || target === String ||
            target instanceof Number || target === Number ||
            target instanceof Boolean || target === Boolean);
    }

    public static isFunction(target: any): boolean {
        return target instanceof Function;
    }

    public static isArray(target: any): boolean {
        return target === Array || Array.isArray(target) || target instanceof Array;
    }

    public static getClass(target: any, propertyName: string): any {
        return Reflect.getMetadata('design:type', target, propertyName);
    }

    public static clone(target: any): any {
        if (target == null) {
            return null;
        }
        const cloneObject = new (target.constructor as any)();
        for (const attr in target) {
            cloneObject[attr] = (typeof target[attr] === 'object') ? this.clone(target[attr]) : target[attr];
            // if (typeof target[attr] === 'object') {
            //     cloneObject[attr] = this.clone(target[attr]);
            // } else {
            //     cloneObject[attr] = target[attr];
            // }
        }
        return cloneObject;
    }
}
