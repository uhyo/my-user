"use strict";
var user_object_1 = require('./user-object');
exports.User = user_object_1.User;
exports.UserConfig = user_object_1.UserConfig;
function init() {
    return new user_object_1.UserConfig();
}
exports.init = init;
