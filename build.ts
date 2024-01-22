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
} else {
	await generate()
}

buildSync({
	entryPoints: ['src/index.ts'],
	format: 'esm',
	outdir: 'dist',
	bundle: true,
	minify: true,
	platform: 'browser',
	tsconfig: path.join(import.meta.dir, 'tsconfig.json'),
	external: [
		...Object.keys({
			...(pkg.dependencies ?? {}),
			// @ts-ignore
			...(pkg.peerDependencies ?? {}),
		}),
	],
})

console.log('✅ Build done!')
