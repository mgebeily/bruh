import nodemon from 'nodemon'
import path from 'path'
import { compile } from '../build'
// @ts-ignore
import { server } from 'lite-server';

export const watch = ({ entryPoint = './' }) => {
  nodemon({
    args: [entryPoint],
    ext: 'html,js,ts,scss,css,md',
    ignore: ['dist/*'],
    script: `${path.join(__dirname, 'script.js')}`
  }).on("start", () => {
    console.log(`Waiting for changes made to ${entryPoint}...`)
  }).on("restart", () => {
    console.log("Changes detected. Rebuilding...")
    compile({ entryPoint, singlePage: true })
  })

  server({ baseDir: './dist' })
}

