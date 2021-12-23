"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var recursiveCopy = function (sourceDirectory, targetDirectory, projectName) {
    for (var _i = 0, _a = (0, fs_1.readdirSync)(sourceDirectory); _i < _a.length; _i++) {
        var file = _a[_i];
        var fullSourcePath = path_1.default.join(sourceDirectory, file);
        var fullTargetPath = path_1.default.join(targetDirectory, file);
        if ((0, fs_1.statSync)(fullSourcePath).isDirectory()) {
            (0, fs_1.mkdirSync)(fullTargetPath);
            recursiveCopy(fullSourcePath, fullTargetPath, projectName);
        }
        else {
            (0, fs_1.writeFileSync)(fullTargetPath, (0, fs_1.readFileSync)(fullSourcePath, 'utf-8').replace('{{ name }}', projectName));
        }
    }
};
var init = function (_a) {
    var name = _a.name;
    if ((0, fs_1.existsSync)(name)) {
        return console.log("Looks like ".concat(name, " already exists."));
    }
    // Create the directory
    (0, fs_1.mkdirSync)(name);
    // Copy the values from defaults
    recursiveCopy(path_1.default.join(__basedir, 'defaults'), path_1.default.join(process.cwd(), name), name);
};
exports.init = init;
