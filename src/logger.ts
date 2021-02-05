import chalk from 'chalk'
import { PathLike } from 'fs'

class Logger {
  static find(path: PathLike, files: string | number, ...messages: string[]) {
    console.log(
      chalk.green.bold('find'),
      'in',
      chalk.bold.underline(path),
      chalk.blue.bold(`${files}`),
      ...messages
    )
  }

  static generate(
    fileName: string,
    path: PathLike,
    lines?: string | number,
    ...messages: string[]
  ) {
    console.log(
      chalk.green.bold('generate'),
      chalk.bold(`\`${fileName}\``),
      'in',
      chalk.bold.underline(path),
      ...(lines ? ['with', chalk.bold.underline.blue(`${lines} lines`)] : []),
      ...messages
    )
  }

  static generateData(
    name: string,
    qnt: string | number,
    ...messages: string[]
  ) {
    console.log(
      chalk.green.bold('generate'),
      chalk.bold.underline.blue(`${qnt}`),
      chalk.blue.bold(`${name}`),
      ...messages
    )
  }

  static using(name: string, value: number | string, ...messages: string[]) {
    console.log(
      chalk.green.bold('using'),
      chalk.blue.bold(chalk`{underline ${value}} ${name}`),
      ...messages
    )
  }
}

export default Logger
