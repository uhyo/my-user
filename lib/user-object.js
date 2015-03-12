///<reference path="./node.d.ts" />
var crypto = require('crypto');
// user object
var User = (function () {
    function User(config) {
        this.config = config;
    }
    User.prototype.getData = function () {
        return this.data == null ? this.data : Object.create(this.data);
    };
    User.prototype.setData = function (data, password, version) {
        if ("number" !== typeof version) {
            if ("number" === typeof password) {
                version = password;
                password = null;
            }
            else {
                version = this.config.getLatestVersion();
            }
        }
        if ("object" !== typeof data) {
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
        this.data = data;
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
    UserConfig.prototype.create = function () {
        return new User(this);
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
