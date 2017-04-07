import {
    User,
    UserConfig,
    UserConfigOptions,
} from './user-object';

export {
    User,
    UserConfig,
    UserConfigOptions,
};

export function init(options?: Partial<UserConfigOptions>): UserConfig{
    return new UserConfig(options);
}
