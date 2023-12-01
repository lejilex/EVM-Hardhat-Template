"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.out = exports.Level = exports.pad = exports.divider = void 0;
const chalk_1 = __importDefault(require("chalk"));
function divider() {
    console.log("--------------------------------------------------------------------------------");
}
exports.divider = divider;
function pad(pad = 30, ...args) {
    let output = [];
    args.forEach((arg, i) => {
        output.push(arg.toString().padEnd(pad));
    });
    console.log(...output);
}
exports.pad = pad;
var Level;
(function (Level) {
    Level["Log"] = "log";
    Level["Info"] = "info";
    Level["Error"] = "error";
    Level["Warn"] = "warn";
})(Level || (exports.Level = Level = {}));
function out(value = "", level = Level.Log) {
    switch (level) {
        case Level.Log: {
            console.log(value);
            break;
        }
        case Level.Error: {
            console.error(chalk_1.default.red(value));
            break;
        }
        case Level.Warn: {
            console.warn(chalk_1.default.yellow(value));
            break;
        }
        case Level.Info: {
            console.info(chalk_1.default.cyan(value));
            break;
        }
        default: {
            console.log(value);
            break;
        }
    }
}
exports.out = out;
