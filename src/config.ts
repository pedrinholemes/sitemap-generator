import * as types from './types'

class DefaultConfig {
  static prettier: types.Options = {
    parser: 'html',
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    trailingComma: 'none',
    endOfLine: 'lf'
  }

  static sitemap: Partial<types.ISitemapConfig> = {
    useSimpleLangs: true,
    robots: { 'User-agent': '*', Allow: '/' },
    saveIn: {
      dir: 'public',
      robots: 'robots.txt',
      sitemap: 'sitemap.xml'
    }
  }
}

export default DefaultConfig
