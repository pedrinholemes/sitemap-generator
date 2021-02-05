import { Options } from 'prettier'

interface ISitemapConfig {
  host: string
  styles?: Array<string>
  useSimpleLangs?: boolean
  robots?: {
    'User-agent'?: '*' | string
    Allow?: '/' | string
  }
  saveIn?: {
    dir?: string
    sitemap?: string
    robots?: string
  }
}
interface INextConfig {
  i18n?: {
    locales?: string[]
    default_locale?: string
    langs?: string[]
  }
  trailingSlash?: boolean
  sitemap: ISitemapConfig
}

interface IConfig {
  prettier: Options
  next: INextConfig
  sitemap: ISitemapConfig
  i18n?: INextConfig['i18n']
}

interface IFields {
  loc: string
  changefreq: string
  priority: string
  lastmod: string
}

export { IConfig, ISitemapConfig, IFields, Options, INextConfig }
