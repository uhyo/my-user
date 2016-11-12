import { User, UserConfig } from './user-object';
export { User, UserConfig };
export declare class Manager {
    private c;
    constructor();
    create(): User;
    setSalt(version: number, bytes: number): void;
    setSalt(version: number, func: () => string): void;
    setPasswordHash(version: number, hashtype: string): void;
    setPasswordHash(version: number, hash: (salt: string, password: string) => string): void;
}
export declare function createManager(): Manager;
