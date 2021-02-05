import Generators from './generators'
import { IConfig, IFields } from './types'

class Builders {
  static xml(fields: IFields[], config: IConfig): string {
    const content = fields.reduce((prev, curr) => {
      let field = ''
      for (const [key, value] of Object.entries(curr)) {
        field += `<${key}>\n${value}\n</${key}>\n`
      }

      // Append previous value and return
      return `${prev}<url>\n${field}\n</url>\n`
    }, '')

    return Generators.xml(content, config)
  }

  static robots(config: IConfig): string {
    const UserAgent =
      config.sitemap.robots && config.sitemap.robots['User-agent']
        ? config.sitemap.robots['User-agent']
        : '*'
    const Allow =
      config.sitemap.robots && config.sitemap.robots.Allow
        ? config.sitemap.robots.Allow
        : '/'
    return `User-agent: ${UserAgent}\nAllow: ${Allow}\nHost: ${config.sitemap.host}\n`
  }
}

export default Builders
