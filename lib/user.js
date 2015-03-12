///<reference path="./node.d.ts" />
var userobject = require('./user-object');
exports.User = userobject.User;
exports.UserConfig = userobject.UserConfig;
var Manager = (function () {
    function Manager() {
        this.c = new exports.UserConfig();
    }
    //user
    Manager.prototype.create = function () {
        return new exports.User(this.c);
    };
    Manager.prototype.setSalt = function (version, arg) {
        this.c.setSalt(version, arg);
    };
    Manager.prototype.setPasswordHash = function (version, arg) {
        this.c.setPasswordHash(version, arg);
    };
    return Manager;
})();
exports.Manager = Manager;
function createManager() {
    return new Manager();
}
exports.createManager = createManager;
