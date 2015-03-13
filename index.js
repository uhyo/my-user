var userobject = require('./lib/user-object');
exports.User = userobject.User;
exports.UserConfig = userobject.UserConfig;
function init() {
    return new exports.UserConfig();
}
exports.init = init;
