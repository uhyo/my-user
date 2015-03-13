import userobject=require('./lib/user-object');

export import User=userobject.User;
export import UserConfig=userobject.UserConfig;

export function init():UserConfig{
    return new UserConfig();
}
