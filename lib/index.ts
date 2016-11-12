import {
    User,
    UserConfig,
} from './user-object';

export {
    User,
    UserConfig,
};

export function init(): UserConfig{
    return new UserConfig();
}
