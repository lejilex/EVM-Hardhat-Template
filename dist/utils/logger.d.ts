export declare function divider(): void;
export declare function pad(pad?: number, ...args: any): void;
export declare enum Level {
    Log = "log",
    Info = "info",
    Error = "error",
    Warn = "warn"
}
export declare function out(value?: any, level?: Level): void;
