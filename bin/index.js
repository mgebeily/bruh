#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var init_1 = require("./commands/init");
// Initialize a project.
// TODO: Do I need to compile this or can I just run as ts?
commander_1.program.command("init")
    .description("Initialize a new project, bruh")
    .action(init_1.init);
