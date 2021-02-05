import Builders from './builders'
import Export from './export'
import Getter from './getter'
import Logger from './logger'

async function start() {
  try {
    const names = await Getter.fileNames()
    const paths = await Getter.paths(names)
    Logger.using('sitemap path', paths.xml)
    Logger.using('robots path', paths.robots)

    const config = await Getter.config()
    Logger.using('host', config.sitemap.host)
    if (config.i18n && config.i18n.langs) {
      Logger.using('base-paths', config.i18n.langs.length + 1)
    }

    const pages = await Getter.pages()
    const pagesDir = await Getter.pagesDir()
    Logger.find(pagesDir, `${pages.length} pages`)

    const fields = await Getter.fields()
    Logger.generateData('paths', fields.length)

    const xml = Builders.xml(fields, config)
    Logger.generate(names.xml, paths.xml, xml.split('\n').length)
    await Export.file(paths.xml, xml)

    const robots = Builders.robots(config)
    Logger.generate(names.robots, paths.robots, robots.split('\n').length)
    await Export.file(paths.robots, robots)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()
