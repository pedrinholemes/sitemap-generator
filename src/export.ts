import { dirname } from 'path'
import { fs } from './utils'

class Export {
  static async file(path: string, content: string): Promise<void> {
    const folder = dirname(path)
    if (!fs.existsSync(folder)) {
      await fs.mkdir(folder)
    }

    await fs.writeFile(path, content)
  }
}

export default Export
