import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs"
import path from "path";

const recursiveCopy = (dir: string, name: string) => {
  for(const file of readdirSync(dir)) {
    if (statSync(file).isDirectory()) {
      recursiveCopy(dir, name)
    } else {
      writeFileSync(path.join(process.cwd(), name, file), readFileSync(file, 'utf-8').replace('{{ name }}', name))
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
  recursiveCopy(path.join(__dirname, 'defaults'), name)
}
