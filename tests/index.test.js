const execa = require('execa')
const { existsSync, mkdtempSync, readFileSync } = require('fs')
const { tmpdir } = require('os')
const { join, resolve } = require('path')

const pkg = require('../package.json')
const SCRIPT_PATH = resolve(__dirname, '..', pkg.bin['create-initializer'])
const TEST_PREFIX = join(tmpdir(), 'create-initializer-')

it('show usage', async () => {
	const { stdout } = await execa(SCRIPT_PATH, [])
	expect(stdout).toBe('Usage: create-initializer <project_name> [args]')
})

test('create javascript project', async () => {
	const baseDir = mkdtempSync(TEST_PREFIX)

	const opts = [
		'create-greet',
		'--description',
		'desc.',
		'--author',
		'"Awesome Doe"',
		'--email',
		'awesome@example.com',
		'--template',
		'javascript',
		'--license',
		'Apache-2.0',
	]
	const { stdout } = await execa(SCRIPT_PATH, opts, { cwd: baseDir })
	expect(stdout).toContain('Read the docs for further information')

	const newReadMe = readFileSync(`${baseDir}/create-greet/README.md`, 'utf-8')
	expect(newReadMe).toContain('# Create Greet')
	expect(newReadMe).toContain('- {{author}} => Awesome Doe')
	expect(newReadMe).toContain('- {{email}} => awesome@example.com')
	expect(newReadMe).toContain(
		'Check https://github.com/ClassicOldSong/create-initializer#template for further details.'
	)

	const newPackageJson = readFileSync(
		`${baseDir}/create-greet/package.json`,
		'utf-8'
	)
	expect(newPackageJson).toContain('"name": "create-greet",')
	expect(newPackageJson).toContain('"description": "desc.",')
	expect(newPackageJson).toContain(
		'"author": "Awesome Doe <awesome@example.com>",'
	)
	expect(newPackageJson).toContain('"license": "Apache-2.0"')

	const newSrcCli = readFileSync(`${baseDir}/create-greet/src/cli.js`, 'utf-8')
	expect(newSrcCli).toContain('#!/usr/bin/env node')
	expect(newSrcCli).toContain("create('create-greet', {")
}, 300000)

it('create typescript project', async () => {
	const baseDir = mkdtempSync(TEST_PREFIX)
	const { stdout } = await execa(
		SCRIPT_PATH,
		[
			'greet',
			'--description',
			'say hello at ease.',
			'--author',
			'John Doe',
			'--email',
			'john@example.com',
			'--license',
			'Apache-2.0',
			'--template',
			'typescript',
		],
		{ cwd: baseDir }
	)
	expect(stdout).toContain('Build the app for production.')

	const testDir = join(baseDir, 'create-greet')
	await execa('npm', ['run', 'build'], {
		cwd: testDir,
	})
	const { stdout: stdout2 } = await execa(
		'node',
		[
			'dist/cli.js',
			'test',
			'--description',
			'Test',
			'--author',
			'someone',
			'--email',
			'someone@example.com',
			'--license',
			'Apache-2.0',
			'--architecture',
			'macOS',
		],
		{
			cwd: testDir,
		}
	)
	expect(stdout2).toContain('Ok you chose macOS')
}, 300000)

test('create unlicensed app', async () => {
	const baseDir = mkdtempSync(TEST_PREFIX)

	const opts = [
		'create-greet',
		'--description',
		'desc.',
		'--author',
		'"Awesome Doe"',
		'--email',
		'awesome@example.com',
		'--template',
		'javascript',
		'--license',
		'UNLICENSED',
	]
	const { stdout } = await execa(SCRIPT_PATH, opts, {
		cwd: baseDir,
	})
	expect(stdout).toContain('Read the docs for further information')

	const newPackageJson = readFileSync(
		join(baseDir, 'create-greet', 'package.json'),
		'utf-8'
	)
	expect(newPackageJson).toContain('"license": "UNLICENSED"')

	const existed = existsSync(`${baseDir}/create-greet/LICENSE`)
	expect(existed).toBeFalsy()
}, 300000)
