export type Constructor<T> = { new(...args: any[]): T };

export const isConstructor = <T>(c: any): c is Constructor<T> => {
    return (c.constructor !== undefined);
}

export type Clonable = {
    clone(): any;
}

export const isClonable = (item: any): item is Clonable => {
    return typeof (item.clone) === 'function';
}