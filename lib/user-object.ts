import * as crypto from 'crypto';
import extend = require('extend');
import deepFreeze = require('deep-freeze-strict');
// user object

export class User<T>{
    //configure
    private config: UserConfig;
    constructor(id: string | null | undefined, config: UserConfig){
        this.id = id || null;
        this.config = config;
    }
    //ID
    public id: string | null;
    //version of password
    public version: number;
    
    //auth data
    public salt: string;
    //hashed
    public password: string;

    //other data
    private data: T;


    public getData(): T{
        return this.data;
    }

    public setData(data: T, password?: string, version?: number):void;
    public setData(data: T, version: number):void;
    public setData(data: T, arg1?: string|number, arg2?: number):void{
        let password: string | undefined, version: number;
        if("number" !== typeof arg2){
            if("number" === typeof arg1){
                version = arg1;
                password = undefined;
            }else{
                password = arg1;
                version = this.config.getLatestVersion();
            }
        }else{
            password = arg1 as string;
            version = arg2;
        }
        if("object"!==typeof data || data==null){
            throw new Error("User data must be an object.");
        }
        //difference of password hash
        let h1 = this.config.getPasswordHash(this.version), h2 = this.config.getPasswordHash(version);
        if(h1 !== h2 && password == null){
            throw new Error("Password is required to update user version from "+this.version+" to "+version+".");
        }
        //set version
        this.version = version;
        if(password != null){
            //set password
            this.salt = this.config.getSalt(version)();
            this.password = h2(this.salt,password);
        }
        //replace data
        this.data = deepFreeze(extend(true, {}, data));
    }
    //load raw data
    public loadRawData(d: {
        id?:string | null;
        version?:number | null;
        salt?:string | null;
        password?:string | null;
        data?:T | null;
    }):void{
        if(d.id!=null){
            this.id=d.id;
        }
        if(d.version!=null){
            this.version=d.version;
        }
        if(d.salt!=null){
            this.salt=d.salt;
        }
        if(d.password!=null){
            this.password=d.password;
        }
        if(d.data!=null){
            this.data=d.data;
        }
    }
    public writeData(obj:any):void{
        this.setData(extend(true,{},this.data,obj),this.version);
    }



    //authenticate
    public auth(password:string):boolean{
        const h=this.config.getPasswordHash(this.version);
        return h(this.salt,password)===this.password;
    }

}

// user config
export class UserConfig{
    //latest version
    private latest:number;
    private first:number;

    constructor(){
        this.latest=-Infinity;
        this.first=Infinity;
        this.data={};

        //default user data
        this.defaults();
    }

    private data:{
        [version:number]:UserConfigData;
    };
    private initd(version:number):void{
        if(this.data[version]==null){
            this.data[version]={};
        }
        if(version > this.latest){
            this.latest=version;
        }
        if(version < this.first){
            this.first=version;
        }
    }
    private get(name:string,version?: number):any{
        let d:any;
        if(version==null){
            version=this.latest;
        }else{
            version=version|0;
        }
        //check
        while(version>=this.first){
            d=this.data[version];
            if(d!=null && d[name]!=null){
                return d[name];
            }
            version--;
        }
        return null;
    }
    private defaults():void{
        //default user version
        this.setSalt(0,16);
        this.setPasswordHash(0,"sha256");
    }
    //create user
    public create<T>(id?:string):User<T>{
        if(id != null && "string" !== typeof id){
            throw new Error("Invalid user id.");
        }
        return new User<T>(id, this);
    }

    //user config setting
    public getLatestVersion():number{
        return this.latest;
    }
    
    public setSalt(version:number,bytes:number):void;
    public setSalt(version:number,func:()=>string):void;
    public setSalt(version:number,arg:any):void{
        version=version|0;
        if("number"===typeof arg){
            //default salt generator
            this.initd(version);
            this.data[version].saltGenerator=generateSaltGenerator(arg);
        }else if("function"===typeof arg){
            this.initd(version);
            this.data[version].saltGenerator=arg;
        }else{
            throw new Error("Invalid salt generator.");
        }
    }

    public getSalt(version?:number):()=>string{
        return this.get("saltGenerator", version);
    }

    public setPasswordHash(version:number,hashtype:string):void;
    public setPasswordHash(version:number,hash:(salt:string,password:string)=>string):void;
    public setPasswordHash(version:number,arg:any):void{
        version=version|0;
        if("string"===typeof arg){
            this.initd(version);
            this.data[version].passwordHash=generatePasswordHash(arg);
        }else if("function"===typeof arg){
            this.initd(version);
            this.data[version].passwordHash=arg;
        }else{
            throw new Error("Invalid password hash.");
        }
    }
    public getPasswordHash(version?:number):(salt:string,password:string)=>string{
        return this.get("passwordHash",version);
    }
}
export interface UserConfigData{
    saltGenerator?():string;
    passwordHash?(salt:string,password:string):string;
}


//------
function generateSaltGenerator(bytes:number):()=>string{
    return ()=>{
        const buf=crypto.pseudoRandomBytes(bytes);
        return buf.toString("hex");
    };
}
function generatePasswordHash(hashtype:string):(salt:string,password:string)=>string{
    const supported=crypto.getHashes();
    if(supported.indexOf(hashtype)===-1){
        throw new Error("Hashtype '"+hashtype+"' is not supported.");
    }
    return (salt:string,password:string)=>{
        var hash=crypto.createHash(hashtype);
        hash.update(String(salt)+String(password),"utf8");
        return hash.digest("hex");
    };
}
