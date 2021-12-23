"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = void 0;
var nodemon_1 = __importDefault(require("nodemon"));
var path_1 = __importDefault(require("path"));
var build_1 = require("../build");
// @ts-ignore
var lite_server_1 = require("lite-server");
var watch = function (_a) {
    var _b = _a.entryPoint, entryPoint = _b === void 0 ? './' : _b;
    (0, nodemon_1.default)({
        args: [entryPoint],
        ext: 'html,js,ts,scss,css,md',
        ignore: ['dist/*'],
        script: "".concat(path_1.default.join(__dirname, 'script.js'))
    }).on("start", function () {
        console.log("Waiting for changes made to ".concat(entryPoint, "..."));
    }).on("restart", function () {
        console.log("Changes detected. Rebuilding...");
        (0, build_1.compile)({ entryPoint: entryPoint, singlePage: true });
    });
    (0, lite_server_1.server)({ baseDir: './dist' });
};
exports.watch = watch;
