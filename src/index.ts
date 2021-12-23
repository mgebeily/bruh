#!/usr/bin/env node

import { program } from 'commander';
import { compile } from './commands/build';
import { init } from './commands/init'
import { watch } from './commands/watch'

// Initialize a project.
// TODO: Do I need to compile this or can I just run as ts?
program.command("init")
  .argument("Name")
  .description("Initialize a new project.")
  .action((name) => init({ name }))

program.command("build")
  .description("Build the current directory's site for distribution.")
  .action(() => compile({ entryPoint: './site', singlePage: true }))

program.command("watch")
  .description("Watch for changes in the current project and build when done.")
  .action(() => watch({ entryPoint: './site' }))
program.parse(process.argv)
