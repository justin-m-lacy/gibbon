export declare type Clonable = {
    clone(): any;
};
export declare type Constructor<T> = {
    new (...args: any[]): T;
};
export declare const isConstructor: <T>(c: any) => c is Constructor<T>;
export declare const isClonable: (item: any) => item is Clonable;
