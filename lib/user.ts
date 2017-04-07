import {
    User,
    UserConfig,
} from './user-object';

export {
    User,
    UserConfig,
};

export class Manager<T>{
    private c:UserConfig;
    constructor(){
        this.c=new UserConfig();
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



export function createManager<T>():Manager<T>{
    return new Manager<T>();
}
