import fsM, { PathLike } from 'fs'
import fsP from 'fs/promises'
import { resolve } from 'path'
import * as types from './types'

const fs = { ...fsM, ...fsP }

class Utils {
  static trailingSlash(config: types.IConfig): '' | '/' {
    return config.next.trailingSlash ? '/' : ''
  }

  static checkExists(path: PathLike) {
    const exists = fs.existsSync(path)
    if (!exists) {
      return this.error(`${path} not exists, please create this`)
    }
  }

  static error(message: string) {
    console.error(new Error(message))
    process.exit(1)
  }

  static isDir(path: PathLike) {
    try {
      fs.readFileSync(path)
    } catch (e) {
      if (e.code === 'EISDIR') return true
    }
    return false
  }

  static async readDir(path: PathLike): Promise<string[]> {
    const files = await fs.readdir(path)
    const withoutUnderlineFile = files.filter(file => !file.startsWith('_'))
    const allFiles = []
    for (const file of withoutUnderlineFile) {
      const filePath = resolve(String(path), file)
      const isDir = this.isDir(filePath)
      if (isDir) {
        if (file === 'api') continue
        const subFiles = await this.readDir(filePath)
        const files = subFiles.map(subFile => `${file}/${subFile}`)
        allFiles.push(...files)
      } else {
        allFiles.push(file)
      }
    }
    allFiles.sort((a, b) => {
      return a.split('/').length - b.split('/').length
    })
    return allFiles
  }

  static format(...paths: string[]) {
    return resolve(process.cwd(), ...paths)
  }
}

export { fs }
export default Utils
