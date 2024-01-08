/// <reference types="bun-types" />

import { buildSync } from 'esbuild'
import pkg from './package.json' assert { type: 'json' }
import * as path from 'node:path'
import * as fs from 'node:fs'
import * as url from 'node:url'

import { generator } from './scripts/generate'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))
const dist = path.join(dirname, 'dist')

const generate = generator(dirname)

if (fs.existsSync(dist)) {
  if (Bun.env.NODE_ENV === 'production') process.exit(0)

  console.log(`🧹 Cleaning dist folder...`)
  fs.rmSync(dist, { recursive: true, force: true })

  console.log('🚛 Generating icons...')
  await generate()
}

buildSync({
  entryPoints: ['src/index.ts'],
  format: 'esm',
  outdir: 'dist',
  bundle: true,
  minify: true,
  platform: 'browser',
  external: [...Object.keys(pkg.peerDependencies)],
})

console.log('✅ Build done!')
