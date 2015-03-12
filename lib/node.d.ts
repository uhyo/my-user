declare function require(path:string):any;
declare var __dirname:string;

declare class Buffer{
    constructor(size:number);
    constructor(arr:Array<number>);
    constructor(buffer:Buffer);
    constructor(str:string,encoding?:string);

    static isEncoding(encoding:string):boolean;
    static isBuffer(obj:any):boolean;
    static byteLength(str:string,encoding?:string):number;
    static concat(list:Array<Buffer>,totalLength?:number):Buffer;
    static compare(buf1:Buffer,buf2:Buffer):number;

    length:number;
    write(str:string,offset?:number,length?:number,encoding?:string):number;
    writeUIntLE(value:number,offset:number,byteLength:number,noAssert?:boolean):number;
    writeUIntBE(value:number,offset:number,byteLength:number,noAssert?:boolean):number;
    writeIntLE(value:number,offset:number,byteLength:number,noAssert?:boolean):number;
    writeIntBE(value:number,offset:number,byteLength:number,noAssert?:boolean):number;
    readUIntLE(offset:number,byteLength:number,noAssert?:boolean):number;
    readUIntBE(offset:number,byteLength:number,noAssert?:boolean):number;
    readIntLE(offset:number,byteLength:number,noAssert?:boolean):number;
    readIntBE(offset:number,byteLength:number,noAssert?:boolean):number;
    toString(encoding?:string,start?:number,end?:number):string;
    toJSON():string;
    [index:number]:number;
    equals(otherBuffer:Buffer):boolean;
    compare(otherBuffer:Buffer):number;
    copy(targetBuffer:Buffer,targetStart?:number,sourceStart?:number,sourceEnd?:number):void;
    slice(start?:number,end?:number):Buffer;
    readUInt8(offset:number,noAssert?:boolean):number;
    readUInt16LE(offset:number,noAssert?:boolean):number;
    readUInt32BE(offset:number,noAssert?:boolean):number;
    readUInt32LE(offset:number,noAssert?:boolean):number;
    readUInt16BE(offset:number,noAssert?:boolean):number;
    readInt8(offset:number,noAssert?:boolean):number;
    readInt16LE(offset:number,noAssert?:boolean):number;
    readInt32BE(offset:number,noAssert?:boolean):number;
    readInt32LE(offset:number,noAssert?:boolean):number;
    readInt16BE(offset:number,noAssert?:boolean):number;
    readFloatLE(offset:number,noAssert?:boolean):number;
    readFloatBE(offset:number,noAssert?:boolean):number;
    readDoubleLE(offset:number,noAssert?:boolean):number;
    readDoubleBE(offset:number,noAssert?:boolean):number;
    writeUInt8(value:number,offset:number,noAssert?:boolean):void;
    writeUInt16LE(value:number,offset:number,noAssert?:boolean):void;
    writeUInt32BE(value:number,offset:number,noAssert?:boolean):void;
    writeUInt32LE(value:number,offset:number,noAssert?:boolean):void;
    writeUInt16BE(value:number,offset:number,noAssert?:boolean):void;
    writeInt8(value:number,offset:number,noAssert?:boolean):void;
    writeInt16LE(value:number,offset:number,noAssert?:boolean):void;
    writeInt32BE(value:number,offset:number,noAssert?:boolean):void;
    writeInt32LE(value:number,offset:number,noAssert?:boolean):void;
    writeInt16BE(value:number,offset:number,noAssert?:boolean):void;
    writeFloatLE(value:number,offset:number,noAssert?:boolean):void;
    writeFloatBE(value:number,offset:number,noAssert?:boolean):void;
    writeDoubleLE(value:number,offset:number,noAssert?:boolean):void;
    writeDoubleBE(value:number,offset:number,noAssert?:boolean):void;
    fill(value:any,offset?:number,end?:number):void;

}
declare class SlowBuffer extends Buffer{
}

declare module "events"{
    export class EventEmitter{
        addEventListener(event:string,listener:Function):EventEmitter;
        on(event:string,listener:Function):EventEmitter;
        once(event:string,listener:Function):EventEmitter;
        removeListener(event:string,listener:Function):EventEmitter;
        removeAllListeners(event?:string):EventEmitter;
        setMaxListener(n:number):void;
        listeners(event:string):Function[];
        emit(event:string,...args:any[]):boolean;

        static listenerCount(emitter:EventEmitter,event:string):number;
    }

}
declare module "stream"{
    import events=require('events');
    export class Readable extends events.EventEmitter{
        read(size?:number):any;
        setEncoding(encoding:string):void;
        resume():void;
        pause():void;
        pipe(destination:Writable,options?:{
            end:boolean;
        }):void;
        unpipe(destionation?:Writable):void;
        unshift(chunk:any):void;
    }
    export class Writable extends events.EventEmitter{
        write(chunk:string,encoding?:string,callback?:Function):boolean;
        end(chunk?:string,encoding?:string,callback?:Function):boolean;
    }
    export class Duplex extends events.EventEmitter{
        read(size?:number):any;
        setEncoding(encoding:string):void;
        resume():void;
        pause():void;
        pipe(destination:Writable,options?:{
            end:boolean;
        }):void;
        unpipe(destionation?:Writable):void;
        unshift(chunk:any):void;
        write(chunk:string,encoding?:string,callback?:Function):boolean;
        end(chunk?:string,encoding?:string,callback?:Function):boolean;
    }
}
declare module "crypto"{
    import stream=require('stream');

    //partial definition.
    export function setEngine(engine:string,flags?:number):void;
    export function getCiphers():Array<string>;
    export function getHashes():Array<string>;
    export function createHash(algorithm:string):Hash;
    export function randomBytes(size:number,callback?:(ex:any,buf:any)=>void):Buffer;
    export function pseudoRandomBytes(size:number,callback?:(ex:any,buf:any)=>void):Buffer;

    export class Hash extends stream.Duplex{
        update(data:any,input_encoding?:string):void;
        digest(encoding?:string):any;
        digest(encoding:"hex"):string;
        digest(encoding:"binary"):Buffer;
        digest(encoding:"base64"):string;
    }
}

declare module "extend"{
    function extend(...args:Array<any>):any;
    export = extend;
}
declare module "deep-freeze-strict"{
    function deepFreeze(obj:any):any;
    export = deepFreeze;
}
