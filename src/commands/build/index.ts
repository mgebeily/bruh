import { build, buildSync, Plugin } from "esbuild"
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, statSync, writeFileSync } from 'fs';
import yaml from 'js-yaml'
import ejs from 'ejs';
import { marked } from 'marked';
import path from "path";
import sassPlugin from 'esbuild-plugin-sass';
// @ts-ignore
import { markdownPlugin } from 'esbuild-plugin-markdown';
import { Route, Routes } from 'groute'

type BuildOptions = {
  entryPoint: string,
  singlePage: boolean
}

const buildData = (base: string, directory: string) => {
  const files = readdirSync(directory);
  let data: any = { files: [], paths: [], children: {} };

  files.forEach((file: string) => {
    const location = path.join(directory, file)

    if (statSync(location).isDirectory()) {
      const childPath = path.join('/', location).replace(path.normalize(`/${base}`), '')
      // Recursively traverse directories
      data.children[path.basename(file)] = {
        path: childPath,
        ...buildData(base, path.join(directory, file))
      }

      data.paths.push(childPath)
    } else if (path.extname(file) === '.json') {
      // Load the JSON file into data
      const result = readFileSync(location, 'utf-8');

      if (file === 'index.json') {
        data = { ...JSON.parse(result), ...data }
      } else {
        data[path.basename(file)] = JSON.parse(result)
      }

      data.files.push(location)
    } else if (path.extname(file) === '.yml') {
      // Load the YAML file into data and parse into an object
      const result = yaml.load(readFileSync(location, 'utf-8')) as string;

      if (file === 'index.yml') {
        // Spread the file at the root if it is index
        data = { ...JSON.parse(result), ...data }
      } else {
        // Otherwise, namespace it under the name of the file
        data[path.basename(file)] = JSON.parse(result.toString())
      }

      data.files.push(location)
    }
  })

  return data;
}


const buildDirectory = async (directory: string, plugins: Plugin[]) => {
  const files = readdirSync(directory);

  for(let x = 0; x < files.length; x++) {
    const file = files[x];

    const location = path.join(directory, file);
    if (!existsSync(path.join('dist', directory))) {
      mkdirSync(path.join('dist', directory))
    }

    if (statSync(location).isDirectory()) {
      await buildDirectory(location, plugins)
    } else if (['.js', '.ts', '.scss', '.css'].includes(path.extname(location))) {
      // TODO: Do not wait
      await build({
        bundle: true,
        entryPoints: [location],
        // TODO: Change to outfile?
        loader: {
          '.html': 'text'
        },
        minify: true,
        outdir: path.join('dist', directory),
        plugins
      })
    } else if (path.extname(location) === '.md') {
      const contents = readFileSync(location, 'utf-8');
      writeFileSync(path.join('dist', directory, 'index.html'), marked(contents));
    } else {
      copyFileSync(
        location,
        path.join('dist', location)
      )
    }
  }
}


const buildBundle = (base: string, directory: string, data: any, directoryData: any = null): Routes => {
  const files = readdirSync(directory);
  const children: Routes = [];

  files.forEach((file) => {
    const location = path.join(directory, file);

    if (statSync(location).isDirectory()) {
      // Add the contents of index.html to the current path
      const html = existsSync(path.join(location, 'index.html')) ?
        readFileSync(path.join(location, 'index.html'), 'utf-8') : '<%- yield %>'

      const js = existsSync(path.join(location, 'index.js')) ?
        readFileSync(path.join(location, 'index.js'), 'utf-8') : ''

      const css = existsSync(path.join(location, 'index.css')) ?
        readFileSync(path.join(location, 'index.css'), 'utf-8') : ''

      // Recurse into the remaining values in the directory, defining the current template as the layout
      // TODO: Rebuild build once here by using the renderedHTML?
      // TODO: Incremental / stream / buffer
      const local = (directoryData || data).children[file]
      const childContent = buildBundle(base, location, data, local)

      // TODO: Make this predictably the name of the path?
      const childOutletIdentifier = `a${Math.floor(Math.random() * 1000000) + 1}`;
      const childOutlet = `<div id="${childOutletIdentifier}"></div>`

      // TODO: root and views?
      // TODO: Option for if yield with no further path is valid?
      const renderedHtml = ejs.render(html, { yield: childOutlet, data, local }) + `<style>${css}</style>`

      const route: Route = {
        path: file === base ? '' : file,
        outlet: `#${childOutletIdentifier}`,
        content: renderedHtml,
        children: childContent,
      }
      if (js) route.onActivate = js as any;
      children.push(route);
    }
  })

  return children;
}

const inlineRequirements = (directory: string) => {

}

// TODO: One pass instead of two? This would limit the available data at any point.
export const compile = async ({ entryPoint = '' }: BuildOptions) => {
  // Create dist if it doesn't exist
  if (existsSync('dist')) rmdirSync('dist', { recursive: true })
  mkdirSync('dist');

  // First, get all of the index files
  const data = buildData(entryPoint, entryPoint);
  const dataPlugin: Plugin = {
    name: 'bruh-data',
    setup: (build) => {
      build.onResolve({ filter: /bruh\.data/ }, ({ path }) => ({ path, namespace: 'bruh-data-ns' }))
      build.onLoad({ filter: /.*/, namespace: 'bruh-data-ns' }, () => ({
        contents: JSON.stringify(data),
        loader: 'json'
      }))
    }
  }

  // Build the lowest common denominator directories into dist. These are shared by the client and server side implementations.
  await buildDirectory(entryPoint, [dataPlugin, markdownPlugin({}), sassPlugin({
    rootDir: process.cwd()
  })])

  // Build the client side bundle
  const children = buildBundle(entryPoint, 'dist', data)
  const routes = [{
    path: '',
    children,
  }]

  // TODO: Replace this with the file when build chunking is implemented
  writeFileSync(path.join(process.cwd(), 'dist', 'client.js'), `
    import { groute } from 'groute';
    var functionize = (route) => {
      if (route.children) {
        route.children = route.children.map((c) => functionize(c));
      }
      if (route.onActivate) {
        route.onActivate = new Function(route.onActivate);
      }
      return route;
    }
    groute(${JSON.stringify(routes)}.map((r) => functionize(r)))`)

  buildSync({
    bundle: true,
    entryPoints: [path.join(process.cwd(), 'dist', 'client.js')],
    minify: true,
    outfile: 'dist/client.js',
    allowOverwrite: true
  })
}
