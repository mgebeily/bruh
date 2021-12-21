"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
var esbuild_1 = require("esbuild");
var fs_1 = require("fs");
var js_yaml_1 = __importDefault(require("js-yaml"));
var ejs_1 = __importDefault(require("ejs"));
var marked_1 = require("marked");
var path_1 = __importDefault(require("path"));
var esbuild_plugin_sass_1 = __importDefault(require("esbuild-plugin-sass"));
// @ts-ignore
var esbuild_plugin_markdown_1 = require("esbuild-plugin-markdown");
var buildData = function (base, directory) {
    var files = (0, fs_1.readdirSync)(directory);
    var data = { files: [], paths: [], children: {} };
    files.forEach(function (file) {
        var location = path_1.default.join(directory, file);
        if ((0, fs_1.statSync)(location).isDirectory()) {
            var childPath = path_1.default.join('/', location).replace(path_1.default.normalize("/".concat(base)), '');
            // Recursively traverse directories
            data.children[path_1.default.basename(file)] = __assign({ path: childPath }, buildData(base, path_1.default.join(directory, file)));
            data.paths.push(childPath);
        }
        else if (path_1.default.extname(file) === '.json') {
            // Load the JSON file into data
            var result = (0, fs_1.readFileSync)(location, 'utf-8');
            if (file === 'index.json') {
                data = __assign(__assign({}, JSON.parse(result)), data);
            }
            else {
                data[path_1.default.basename(file)] = JSON.parse(result);
            }
            data.files.push(location);
        }
        else if (path_1.default.extname(file) === '.yml') {
            // Load the YAML file into data and parse into an object
            var result = js_yaml_1.default.load((0, fs_1.readFileSync)(location, 'utf-8'));
            if (file === 'index.yml') {
                // Spread the file at the root if it is index
                data = __assign(__assign({}, JSON.parse(result)), data);
            }
            else {
                // Otherwise, namespace it under the name of the file
                data[path_1.default.basename(file)] = JSON.parse(result.toString());
            }
            data.files.push(location);
        }
    });
    return data;
};
var buildDirectory = function (directory, plugins) { return __awaiter(void 0, void 0, void 0, function () {
    var files, x, file, location_1, contents;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = (0, fs_1.readdirSync)(directory);
                x = 0;
                _a.label = 1;
            case 1:
                if (!(x < files.length)) return [3 /*break*/, 7];
                file = files[x];
                location_1 = path_1.default.join(directory, file);
                if (!(0, fs_1.existsSync)(path_1.default.join('dist', directory))) {
                    (0, fs_1.mkdirSync)(path_1.default.join('dist', directory));
                }
                if (!(0, fs_1.statSync)(location_1).isDirectory()) return [3 /*break*/, 3];
                return [4 /*yield*/, buildDirectory(location_1, plugins)];
            case 2:
                _a.sent();
                return [3 /*break*/, 6];
            case 3:
                if (!['.js', '.ts', '.scss', '.css'].includes(path_1.default.extname(location_1))) return [3 /*break*/, 5];
                // TODO: Do not wait
                return [4 /*yield*/, (0, esbuild_1.build)({
                        bundle: true,
                        entryPoints: [location_1],
                        // TODO: Change to outfile?
                        loader: {
                            '.html': 'text'
                        },
                        minify: true,
                        outdir: path_1.default.join('dist', directory),
                        plugins: plugins
                    })];
            case 4:
                // TODO: Do not wait
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                if (path_1.default.extname(location_1) === '.md') {
                    contents = (0, fs_1.readFileSync)(location_1, 'utf-8');
                    (0, fs_1.writeFileSync)(path_1.default.join('dist', directory, 'index.html'), (0, marked_1.marked)(contents));
                }
                else {
                    (0, fs_1.copyFileSync)(location_1, path_1.default.join('dist', location_1));
                }
                _a.label = 6;
            case 6:
                x++;
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}); };
var buildBundle = function (base, directory, data, directoryData) {
    if (directoryData === void 0) { directoryData = null; }
    var files = (0, fs_1.readdirSync)(directory);
    var children = [];
    files.forEach(function (file) {
        var location = path_1.default.join(directory, file);
        if ((0, fs_1.statSync)(location).isDirectory()) {
            // Add the contents of index.html to the current path
            var html = (0, fs_1.existsSync)(path_1.default.join(location, 'index.html')) ?
                (0, fs_1.readFileSync)(path_1.default.join(location, 'index.html'), 'utf-8') : '<%- yield %>';
            var js = (0, fs_1.existsSync)(path_1.default.join(location, 'index.js')) ?
                (0, fs_1.readFileSync)(path_1.default.join(location, 'index.js'), 'utf-8') : '';
            var css = (0, fs_1.existsSync)(path_1.default.join(location, 'index.css')) ?
                (0, fs_1.readFileSync)(path_1.default.join(location, 'index.css'), 'utf-8') : '';
            // Recurse into the remaining values in the directory, defining the current template as the layout
            // TODO: Rebuild build once here by using the renderedHTML?
            // TODO: Incremental / stream / buffer
            var local = (directoryData || data).children[file];
            var childContent = buildBundle(base, location, data, local);
            // TODO: Make this predictably the name of the path?
            var childOutletIdentifier = "a".concat(Math.floor(Math.random() * 1000000) + 1);
            var childOutlet = "<div id=\"".concat(childOutletIdentifier, "\"></div>");
            // TODO: root and views?
            // TODO: Option for if yield with no further path is valid?
            var renderedHtml = ejs_1.default.render(html, { yield: childOutlet, data: data, local: local }) + "<style>".concat(css, "</style>");
            var route = {
                path: file === base ? '' : file,
                outlet: "#".concat(childOutletIdentifier),
                content: renderedHtml,
                children: childContent,
            };
            if (js)
                route.onActivate = js;
            children.push(route);
        }
    });
    return children;
};
var inlineRequirements = function (directory) {
};
// TODO: One pass instead of two? This would limit the available data at any point.
var compile = function (_a) {
    var _b = _a.entryPoint, entryPoint = _b === void 0 ? '' : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var data, dataPlugin, children, routes;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    // Create dist if it doesn't exist
                    if ((0, fs_1.existsSync)('dist'))
                        (0, fs_1.rmdirSync)('dist', { recursive: true });
                    (0, fs_1.mkdirSync)('dist');
                    data = buildData(entryPoint, entryPoint);
                    dataPlugin = {
                        name: 'bruh-data',
                        setup: function (build) {
                            build.onResolve({ filter: /bruh\.data/ }, function (_a) {
                                var path = _a.path;
                                return ({ path: path, namespace: 'bruh-data-ns' });
                            });
                            build.onLoad({ filter: /.*/, namespace: 'bruh-data-ns' }, function () { return ({
                                contents: JSON.stringify(data),
                                loader: 'json'
                            }); });
                        }
                    };
                    // Build the lowest common denominator directories into dist. These are shared by the client and server side implementations.
                    return [4 /*yield*/, buildDirectory(entryPoint, [dataPlugin, (0, esbuild_plugin_markdown_1.markdownPlugin)({}), (0, esbuild_plugin_sass_1.default)({
                                rootDir: process.cwd()
                            })])
                        // Build the client side bundle
                    ];
                case 1:
                    // Build the lowest common denominator directories into dist. These are shared by the client and server side implementations.
                    _c.sent();
                    children = buildBundle(entryPoint, 'dist', data);
                    routes = [{
                            path: '',
                            children: children,
                        }];
                    // TODO: Replace this with the file when build chunking is implemented
                    (0, fs_1.writeFileSync)(path_1.default.join(process.cwd(), 'dist', 'client.js'), "\n    import { groute } from 'groute';\n    var functionize = (route) => {\n      if (route.children) {\n        route.children = route.children.map((c) => functionize(c));\n      }\n      if (route.onActivate) {\n        route.onActivate = new Function(route.onActivate);\n      }\n      return route;\n    }\n    groute(".concat(JSON.stringify(routes), ".map((r) => functionize(r)))"));
                    (0, esbuild_1.buildSync)({
                        bundle: true,
                        entryPoints: [path_1.default.join(process.cwd(), 'dist', 'client.js')],
                        minify: true,
                        outfile: 'dist/client.js',
                        allowOverwrite: true
                    });
                    return [2 /*return*/];
            }
        });
    });
};
exports.compile = compile;
