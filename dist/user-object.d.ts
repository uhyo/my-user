export declare class User {
    private config;
    constructor(id: string | null | undefined, config: UserConfig);
    id: string | null;
    version: number;
    salt: string;
    password: string;
    private data;
    getData(): any;
    setData(data: any, password?: string, version?: number): void;
    setData(data: any, version: number): void;
    loadRawData(d: {
        id?: string;
        version?: number;
        salt?: string;
        password?: string;
        data?: any;
    }): void;
    writeData(obj: any): void;
    auth(password: string): boolean;
}
export declare class UserConfig {
    private latest;
    private first;
    constructor();
    private data;
    private initd(version);
    private get(name, version?);
    private defaults();
    create(id?: string): User;
    getLatestVersion(): number;
    setSalt(version: number, bytes: number): void;
    setSalt(version: number, func: () => string): void;
    getSalt(version?: number): () => string;
    setPasswordHash(version: number, hashtype: string): void;
    setPasswordHash(version: number, hash: (salt: string, password: string) => string): void;
    getPasswordHash(version?: number): (salt: string, password: string) => string;
}
export interface UserConfigData {
    saltGenerator?(): string;
    passwordHash?(salt: string, password: string): string;
}
