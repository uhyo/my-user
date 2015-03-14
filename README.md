# my-user v.0.1.0

`my-user` is my simple user objects for me, supporting **authentication**.

User objects hold user id, authentication data, and other data.

## Installation
```sh
npm install my-user
```

## TypeScript declaration file
Available at `node_modules/my-user/lib.d.ts`.

## Usage
Init `UserConfig` and create `User`:

```js
var userconfig=require('my-user').init();

// Create user
var user=userconfig.create("user_id");


// Set password and extra data
user.setData({
    /* extra data */
    foo: "bar",
    hoge: new Date()
},"password");

//authenticate
console.log(user.auth("wrongpassword"));    //false
console.log(user.auth("password"));         //true

//read data
var data=user.getData();
console.log(data);
```

## Versioning and auth methods
User objects have **versions**.

Different versions may have different auth methods.

```js
var userconfig=require('my-user').init();

//Set salt length by bytes
userconfig.setSalt(1,16);	//version 1 -> 16 bytes

//User-defined salt generator
userconfig.setSalt(2,function(){
    return "static salt";
});

//Password hash function
userconfig.setPasswordHash(1,"md5");

//User-defined hash function
userconfig.setPasswordHash(2,function(salt,password){
    return salt+password;
});


var user=userconfig.create();

//indicate user version
user.setData({},"password",1);

console.log(user.version === 1);     //true

//if version is omitted, it will be the latest
user.setData({},"new_password");

console.log(user.version === 2);      //true
```

## APIs

### init()
Returns new instance of `UserConfig`.

### userconfig.create([userid])
Returns new instance of `User`.

### userconfig.setSalt(version,bytes)
Set salt-generation function of version `version` to `crypto.pseudoRandomBytes(bytes)`.

Salts will be represented by hex string.

### userconfig.setSalt(version,func)
Set salt-generation function of version `version` to `func`.

`func` takes no argument and returns string.

### userconfig.setPasswordHash(version,type)
Set password hash function of version `version` to `type`.

`type` is string representing hash function supported by `crypto`.

### userconfig.setPasswordHash(version,func)
Set password hash function of version `version` to `func`.

`func` takes 2 arguments `salt` and `password` and returns string.

### userconfig.getSalt([version])
returns salt-generation function of version `version` (the latest if omitted).

### userconfig.getPasswordHash([version])
returns password hash function of version `version` (the latest if omitted).

### user.id
User id string.

### user.version
The version of user represented by integer.

### user.salt
Salt string.

### user.password
Hashed password string.

### user.setData(data[, password][, version])
Set user's extra data, optionally password, and optionally version.

If `version` is omitted, it will be the latest.

`password` is required when password hash function changes by upgrading/downgrading.

### user.getData()
Returns user's current extra data.

### user.auth(password)
Checks if `password` is currect. Returns boolean value.

