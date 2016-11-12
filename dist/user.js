"use strict";
var user_object_1 = require('./user-object');
exports.User = user_object_1.User;
exports.UserConfig = user_object_1.UserConfig;
var Manager = (function () {
    function Manager() {
        this.c = new user_object_1.UserConfig();
    }
    //user
    Manager.prototype.create = function () {
        return new user_object_1.User(null, this.c);
    };
    Manager.prototype.setSalt = function (version, arg) {
        this.c.setSalt(version, arg);
    };
    Manager.prototype.setPasswordHash = function (version, arg) {
        this.c.setPasswordHash(version, arg);
    };
    return Manager;
}());
exports.Manager = Manager;
function createManager() {
    return new Manager();
}
exports.createManager = createManager;
