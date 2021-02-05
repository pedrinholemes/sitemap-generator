import { format } from 'prettier'
import { IConfig } from './types'

class Generator {
  static xml(content: string, config: IConfig): string {
    const styles = config.sitemap.styles
      ? config.sitemap.styles.map(style => `${Generator.styles(style)}\n`)
      : []

    const file = `<?xml version="1.0" encoding="UTF-8"?>${styles.join('')}
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
        ${content}
      </urlset>
    `

    return format(file, config.prettier)
  }

  static styles(url: string): string {
    const split = url.split('.')
    const type = split[split.length - 1]
    return `<?xml-stylesheet type="text/${type}" href="${url}" ?>`
  }
}

export default Generator
