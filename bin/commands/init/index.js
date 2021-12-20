"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var recursiveCopy = function (dir, name) {
    for (var _i = 0, _a = fs_1.readdirSync(dir); _i < _a.length; _i++) {
        var file = _a[_i];
        if (fs_1.statSync(file).isDirectory()) {
            recursiveCopy(dir, name);
        }
        else {
            fs_1.writeFileSync(path_1.default.join(process.cwd(), name, file), fs_1.readFileSync(file, 'utf-8').replace('{{ name }}', name));
        }
    }
};
exports.init = function (_a) {
    var name = _a.name;
    if (fs_1.existsSync(name)) {
        return console.log("Looks like " + name + " already exists.");
    }
    // Create the directory
    fs_1.mkdirSync(name);
    // Copy the values from defaults
    recursiveCopy(path_1.default.join(__dirname, 'defaults'), name);
};
