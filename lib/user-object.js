///<reference path="./node.d.ts" />
var crypto = require('crypto');
var extend = require('extend');
var deepFreeze = require('deep-freeze-strict');
// user object
var User = (function () {
    function User(id, config) {
        this.id = id || null;
        this.config = config;
    }
    User.prototype.getData = function () {
        return this.data;
    };
    User.prototype.setData = function (data, arg1, arg2) {
        var password, version;
        if ("number" !== typeof arg2) {
            if ("number" === typeof arg1) {
                version = arg1;
                password = null;
            }
            else {
                password = arg1;
                version = this.config.getLatestVersion();
            }
        }
        else {
            password = arg1, version = arg2;
        }
        if ("object" !== typeof data || data == null) {
            throw new Error("User data must be an object.");
        }
        //difference of password hash
        var h1 = this.config.getPasswordHash(this.version), h2 = this.config.getPasswordHash(version);
        if (h1 !== h2 && password == null) {
            throw new Error("Password is required to update user version from " + this.version + " to " + version + ".");
        }
        //set version
        this.version = version;
        if (password != null) {
            //set password
            this.salt = this.config.getSalt(version)();
            this.password = h2(this.salt, password);
        }
        //replace data
        this.data = deepFreeze(extend(true, {}, data));
    };
    //load raw data
    User.prototype.loadRawData = function (d) {
        if (d.id != null) {
            this.id = d.id;
        }
        if (d.version != null) {
            this.version = d.version;
        }
        if (d.salt != null) {
            this.salt = d.salt;
        }
        if (d.password != null) {
            this.password = d.password;
        }
        if (d.data != null) {
            this.data = d.data;
        }
    };
    User.prototype.writeData = function (obj) {
        this.setData(extend(true, {}, this.data, obj), this.version);
    };
    //authenticate
    User.prototype.auth = function (password) {
        var h = this.config.getPasswordHash(this.version);
        return h(this.salt, password) === this.password;
    };
    return User;
})();
exports.User = User;
// user config
var UserConfig = (function () {
    function UserConfig() {
        this.latest = -Infinity;
        this.first = Infinity;
        this.data = {};
        //default user data
        this.defaults();
    }
    UserConfig.prototype.initd = function (version) {
        if (this.data[version] == null) {
            this.data[version] = {};
        }
        if (version > this.latest) {
            this.latest = version;
        }
        if (version < this.first) {
            this.first = version;
        }
    };
    UserConfig.prototype.get = function (name, version) {
        var d;
        if (version == null) {
            version = this.latest;
        }
        else {
            version = version | 0;
        }
        while (version >= this.first) {
            d = this.data[version];
            if (d != null && d[name] != null) {
                return d[name];
            }
            version--;
        }
        return null;
    };
    UserConfig.prototype.defaults = function () {
        //default user version
        this.setSalt(0, 16);
        this.setPasswordHash(0, "sha256");
    };
    //create user
    UserConfig.prototype.create = function (id) {
        if (id != null && "string" !== typeof id) {
            throw new Error("Invalid user id.");
        }
        return new User(id, this);
    };
    //user config setting
    UserConfig.prototype.getLatestVersion = function () {
        return this.latest;
    };
    UserConfig.prototype.setSalt = function (version, arg) {
        version = version | 0;
        if ("number" === typeof arg) {
            //default salt generator
            this.initd(version);
            this.data[version].saltGenerator = generateSaltGenerator(arg);
        }
        else if ("function" === typeof arg) {
            this.initd(version);
            this.data[version].saltGenerator = arg;
        }
        else {
            throw new Error("Invalid salt generator.");
        }
    };
    UserConfig.prototype.getSalt = function (version) {
        return this.get("saltGenerator", version);
    };
    UserConfig.prototype.setPasswordHash = function (version, arg) {
        version = version | 0;
        if ("string" === typeof arg) {
            this.initd(version);
            this.data[version].passwordHash = generatePasswordHash(arg);
        }
        else if ("function" === typeof arg) {
            this.initd(version);
            this.data[version].passwordHash = arg;
        }
        else {
            throw new Error("Invalid password hash.");
        }
    };
    UserConfig.prototype.getPasswordHash = function (version) {
        return this.get("passwordHash", version);
    };
    return UserConfig;
})();
exports.UserConfig = UserConfig;
//------
function generateSaltGenerator(bytes) {
    return function () {
        var buf = crypto.pseudoRandomBytes(bytes);
        return buf.toString("hex");
    };
}
function generatePasswordHash(hashtype) {
    var supported = crypto.getHashes();
    if (supported.indexOf(hashtype) === -1) {
        throw new Error("Hashtype '" + hashtype + "' is not supported.");
    }
    return function (salt, password) {
        var hash = crypto.createHash(hashtype);
        hash.update(String(salt) + String(password), "utf8");
        return hash.digest("hex");
    };
}
