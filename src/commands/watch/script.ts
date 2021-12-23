import { compile } from "../build";

compile({ entryPoint: process.argv[2], singlePage: true })
