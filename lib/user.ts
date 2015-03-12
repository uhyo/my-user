///<reference path="./node.d.ts" />
import userobject=require('./user-object');

export import User=userobject.User;
export import UserConfig=userobject.UserConfig;

export class Manager{
    private c:UserConfig;
    constructor(){
        this.c=new UserConfig();
    }
    //user
    create():User{
        return new User(this.c);
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



export function createManager():Manager{
    return new Manager();
}