#!/usr/bin/env node

import { program } from 'commander';
import { init } from './commands/init'

// Initialize a project.
// TODO: Do I need to compile this or can I just run as ts?
program.command("init")
  .argument("Name")
  .description("Initialize a new project, bruh")
  .action((name) => init({ name }))

program.parse(process.argv)