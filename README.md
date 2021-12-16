# 🦧 Bruh
A bone-simple SSG for huge morons

## Motivation
It's not that static site generators (SSGs) are any harder to use than other web technologies, it's just that they feel like they should be easier than all of them. It didn't feel like there were any good options for setting up a stupid simple site that existed somewhere between "Wordpress" and "fully fledged application". I tried to make one - stupid simple, opinionated, limited. 

## Installation
```
yarn global add bruh
```
or
```
npm install -g bruh
```

## Getting started

```
bruh init my-site
cd my-site
```

## Concepts

Bruh structures a site a lot like some of the earliest sites on the internet probably did - by using the file structure as the path layout. For example, a folder structure like:
```
/articles
	/my-first-article
	/my-second-article
```
will generate a site with the following paths:
```
/articles
/articles/my-first-article
/articles/my-second-article
```
It also supports query parameters like so:
```
/users
	/_id
```
which will generate paths matching:
```
/users/:id
```
and pass the matched variable (id) to the JavaScript functions (see below).

The content at each of these paths determines what renders at each of them.

## Named files
### index.html / index.md
This is the main file that guides what displays at the current route. It is an EJS-compiled HTML or Markdown file. It's also the layout that displays the content of any subdirectories, by using the `<%- yield %>` keyword in EJS. 

### index.js / index.ts
This file will be compiled and run whenever the route represented by the current directory (or its children) is activated. It's compiled by esbuild, so feel free to import external modules for use in this file. 

### index.css / index.scss
This file injects styles that will be present on the page represented by the current directory, or on any of its children.

SCSS files are compiled by esbuild. You can import external files but because of a limitation in SASS support you might have to use fully relative paths.

### index.json / index.yml / *.json / *.yml
These files represents any other data you want made available to the ejs or javascript on your page. `index.json` and `index.yml` will both appear at the top level of the data object, while any other named will appear nested with a property corresponding to the file name.

## Commands
TODO

## Examples
TODO

