declare module "my-user"{
    export class User{
        constructor(id:string,config:UserConfig);
        id:string;
        version:number;
        salt:string;
        password:string;

        getData():any;
        setData(data:any,password?:string,version?:number):void;
        setData(data:any,version:number):void;
        loadRawData(data:{
            id?:string;
            version?:number;
            salt?:string;
            password?:string;
            data?:any;
        }):void;

        auth(password:string):boolean;
    }

    export class UserConfig{
        constructor();
        create(id?:string):User;

        getLatestVersion():number;

        setSalt(version:number,bytes:number):void;
        setSalt(version:number,func:()=>string):void;
        getSalt(version?:number):()=>string;

        setPasswordHash(version:number,hashtype:string):void;
        setPasswordHash(version:number,hash:(salt:string,password:string)=>string):void;

        getPasswordHash(version?:number):(salt:string,password:string)=>string;
    }
}
