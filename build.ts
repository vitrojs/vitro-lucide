/// <reference types="bun-types" />

import { buildSync } from 'esbuild'
import * as fs from 'node:fs'
import * as path from 'node:path'
import pkg from './package.json' assert { type: 'json' }

import { generator } from './scripts/generate'

const isProduction = Bun.env.NODE_ENV === 'production'

const dist = path.join(import.meta.dir, 'dist')

const generate = generator(import.meta.dir)

if (fs.existsSync(dist)) {
  if (isProduction) process.exit(0)

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
