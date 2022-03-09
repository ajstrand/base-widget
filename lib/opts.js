import pkgFS from "fs-extra"
const { readFile } = pkgFS
import path, { resolve } from "path"
import { fileURLToPath } from "url"
import rc from "rc"
import pkg from "slap-util"
const { parseOpts } = pkg
import "regenerator-runtime/runtime.js"

const readJson = async () => {
  const json = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url))
  )
  const { name } = json

  const __filename = fileURLToPath(import.meta.url)

  const __dirname = path.dirname(__filename)
  const configFile = resolve(__dirname, "..", `${name}.ini`)
  const optsResult = parseOpts(rc(name, configFile))
  return optsResult
}

const getData = async () => {
  const res = await readJson()
  return res
}

export default getData()
