
export type Clonable<T> = {
    clone(): T;
}

export type Constructor<T> = { new(...args: any[]): T };

export const isConstructor = <T>(c: any): c is Constructor<T> => {
    return (c.constructor !== undefined);
}


export const isClonable = <T>(item: any): item is Clonable<T> => {
    return typeof (item.clone) === 'function';
}