import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs"
import path from "path";

const recursiveCopy = (sourceDirectory: string, targetDirectory: string, projectName: string) => {
  for(const file of readdirSync(sourceDirectory)) {
    const fullSourcePath = path.join(sourceDirectory, file);
    const fullTargetPath = path.join(targetDirectory, file);

    if (statSync(fullSourcePath).isDirectory()) {
      mkdirSync(fullTargetPath);
      recursiveCopy(fullSourcePath, fullTargetPath, projectName)
    } else {
      writeFileSync(fullTargetPath, readFileSync(fullSourcePath, 'utf-8').replace('{{ name }}', projectName))
    }
  }
}

export const init = ({ name }: { name: string}) => {
  if(existsSync(name)) {
    return console.log(`Looks like ${name} already exists.`);
  }

  // Create the directory
  mkdirSync(name)

  // Copy the values from defaults
  recursiveCopy(path.join(__basedir, 'defaults'), path.join(process.cwd(), name), name)
}

declare var __basedir: string;