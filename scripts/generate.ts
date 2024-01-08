/// <reference types="bun-types" />
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'

const re = />(.*)<\/svg>/

export function generator(cwd: string) {
  const iconsZipball = path.join(cwd, 'icons.zip')
  const iconsAssetsDir = path.join(cwd, 'icons')
  const iconsGeneratedSrcDir = path.join(cwd, 'src/icons')
  const iconIndex = path.join(cwd, 'src/index.ts')

  async function downloadIcons() {
    console.log('Downloading icons...')
    const url = 'https://api.github.com/repos/lucide-icons/lucide/releases'
    const data = await fetch(url).then((it) => it.json())
    const latest = data[0]
    const zipball_url = latest.assets.find((it) =>
      it.name.includes('lucide-icons'),
    ).browser_download_url
    if (!zipball_url) {
      console.error(`Could not find zipball_url for ${url}`)
      process.exit(1)
    }
    console.log(`Downloading ${zipball_url}...`)
    const binary = await fetch(zipball_url).then((it) => it.arrayBuffer())
    const dl_file = Bun.file(iconsZipball)
    dl_file.writer().write(binary)
    Bun.spawnSync({
      cmd: ['unzip', '-o', '-d', cwd, iconsZipball],
    })
    fs.rmSync(iconsZipball)
  }

  async function generate() {
    if (!fs.existsSync(iconsGeneratedSrcDir)) {
      fs.mkdirSync(iconsGeneratedSrcDir)
    }

    if (!fs.existsSync(iconsAssetsDir)) {
      await downloadIcons()
    }

    const files = fs.readdirSync(iconsAssetsDir)

    const names: string[] = []

    for (const file of files) {
      if (!file.endsWith('.svg')) continue
      const name = file.replace('.svg', '')
      const content = fs
        .readFileSync(path.join(iconsAssetsDir, file), 'utf8')
        .split('\n')
        .map((it) => it.trim())
        .join('')
      const matches = content.match(re)
      const nodes = matches?.at(1)
      if (!nodes) {
        console.error(`Could not parse ${file} content`)
        process.exit(1)
      }

      const code = `import type { LucideProps } from '../types';
import { Icon } from '../icon';
export const ${titleName(
        name,
      )} = (props: LucideProps) => (<Icon {...props} name='${name}' nodes={\`${nodes}\`} />);`

      fs.writeFileSync(path.join(iconsGeneratedSrcDir, `${name}.tsx`), code)
      names.push(name)
    }

    // generate index
    const indexCode = names
      .map((name) => `export {${titleName(name)}} from './icons/${name}'`)
      .join('\n')

    fs.writeFileSync(iconIndex, indexCode)

    fs.rmSync(iconsAssetsDir, { recursive: true, force: true })
  }

  function titleName(name: string) {
    return name
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('')
  }

  return generate
}
