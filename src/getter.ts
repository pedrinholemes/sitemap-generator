import path from 'path'
import prettier from 'prettier'
import DefaultConfig from './config'
import * as types from './types'
import Utils, { fs } from './utils'

let cachedConfig: types.IConfig

class Get {
  static async config(): Promise<types.IConfig> {
    if (cachedConfig) return cachedConfig
    const prettier = await this.prettier()

    const nextPath = path.resolve('next.config.js')
    Utils.checkExists(nextPath)

    const next = require(nextPath)
    if (!next.sitemap) {
      Utils.error('`sitemap` is not defined in `' + nextPath + '`')
    }

    if (!next.sitemap.host) {
      Utils.error('`sitemap.host` is not defined in `' + nextPath + '`')
    }

    next.sitemap.host = next.sitemap.host.endsWith('/')
      ? next.sitemap.host.slice(0, next.sitemap.host.length)
      : next.sitemap.host

    const sitemap = { ...DefaultConfig.sitemap, ...next.sitemap }

    const langs =
      next.i18n &&
      (sitemap.useSimpleLangs
        ? this.langs(next.i18n.locales)
        : next.i18n.locales)

    const config: types.IConfig = {
      next: {
        sitemap,
        trailingSlash: next.trailingSlash
      },
      sitemap,
      prettier
    }

    if (next.i18n) {
      const i18n = { ...next.i18n, langs }
      config.i18n = i18n
      config.next.i18n = i18n
    }

    cachedConfig = config

    return config
  }

  static langs(langs: string[]): string[] {
    return langs.reduce((arr, cur) => {
      const [singleLang] = cur.split('-')
      return [...arr, cur, singleLang]
    }, [] as string[])
  }

  static async prettier(): Promise<types.Options> {
    let config = await prettier.resolveConfig(process.cwd())
    config = config || require('package.json').prettier
    return { ...DefaultConfig.prettier, ...config, parser: 'html' }
  }

  static async pagesDir() {
    const srcDirExists = fs.existsSync(path.resolve('src'))
    const pagesDir = srcDirExists
      ? path.resolve('src', 'pages')
      : path.resolve('pages')

    Utils.checkExists(pagesDir)

    return pagesDir
  }

  static async pages(): Promise<string[]> {
    const path = await this.pagesDir()
    const files = await Utils.readDir(path)

    return files.map(file => file.split('.')[0])
  }

  static async fields() {
    const pages = await this.pages()
    const config = await this.config()
    const trailingSlash = Utils.trailingSlash(config)
    const fields = []

    const { host } = config.sitemap

    for (const page of pages) {
      fields.push(this.props({ host, page, trailingSlash }))

      if (config.i18n && config.i18n.langs) {
        for (const lang of config.i18n.langs) {
          fields.push(this.props({ host, page, trailingSlash, lang }))
        }
      }
    }

    return fields
  }

  static props({
    host,
    page,
    trailingSlash,
    lang
  }: {
    host: string
    page: string
    trailingSlash?: string
    lang?: string
  }) {
    const defaultProps = {
      loc: '',
      changefreq: 'daily',
      priority: '0.7',
      lastmod: new Date().toISOString()
    }
    trailingSlash = trailingSlash || ''
    let base = `${host}`
    if (lang) {
      base = `${host}/${lang}`
    }
    if (page.endsWith('/index')) {
      return {
        ...defaultProps,
        loc: `${base}/${page.slice(
          0,
          page.length - '/index'.length
        )}${trailingSlash}`
      }
    }
    return {
      ...defaultProps,
      loc:
        page === 'index'
          ? `${base}${trailingSlash}`
          : `${base}/${page}${trailingSlash}`
    }
  }

  static async paths(names?: { dir: string; xml: string; robots: string }) {
    names = names || (await this.fileNames())
    const format = Utils.format
    return {
      xml: format(process.cwd(), names.dir, names.xml),
      robots: format(process.cwd(), names.dir, names.robots)
    }
  }

  static async fileNames() {
    const config = await this.config()
    const dir = (config.sitemap.saveIn && config.sitemap.saveIn.dir) || 'public'
    const xml =
      (config.sitemap.saveIn && config.sitemap.saveIn.sitemap) || 'sitemap.xml'
    const robots =
      (config.sitemap.saveIn && config.sitemap.saveIn.robots) || 'robots.txt'
    return { dir, xml, robots }
  }
}

export default Get
