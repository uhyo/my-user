import {
    User,
    UserConfig,
    UserConfigOptions,
} from './user-object';

export {
    User,
    UserConfig,
    UserConfigOptions,
};

export class Manager<T>{
    private c:UserConfig;
    constructor(options?: Partial<UserConfigOptions>){
        this.c=new UserConfig(options);
    }
    //user
    create():User<T>{
        return new User<T>(null, this.c);
    }

    //config
    public setSalt(version:number,bytes:number):void;
    public setSalt(version:number,func:()=>string):void;
    public setSalt(version:number,arg:any):void{
        this.c.setSalt(version,arg);
    }
    public setPasswordHash(version:number,hashtype:string):void;
    public setPasswordHash(version:number,hash:(salt:string,password:string)=>string):void;
    public setPasswordHash(version:number,arg:any):void{
        this.c.setPasswordHash(version,arg);
    }
}



export function createManager<T>(options?: Partial<UserConfigOptions>):Manager<T>{
    return new Manager<T>(options);
}
