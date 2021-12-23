#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var build_1 = require("./commands/build");
var init_1 = require("./commands/init");
var watch_1 = require("./commands/watch");
// Initialize a project.
// TODO: Do I need to compile this or can I just run as ts?
commander_1.program.command("init")
    .argument("Name")
    .description("Initialize a new project.")
    .action(function (name) { return (0, init_1.init)({ name: name }); });
commander_1.program.command("build")
    .description("Build the current directory's site for distribution.")
    .action(function () { return (0, build_1.compile)({ entryPoint: './site', singlePage: true }); });
commander_1.program.command("watch")
    .description("Watch for changes in the current project and build when done.")
    .action(function () { return (0, watch_1.watch)({ entryPoint: './site' }); });
commander_1.program.parse(process.argv);
