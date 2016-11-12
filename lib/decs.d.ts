declare module "deep-freeze-strict"{
    function deepFreeze<T>(obj:T):T;
    module deepFreeze{}

    export = deepFreeze;
}


