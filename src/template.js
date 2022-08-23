const fs = require("fs/promises")
const Handlebars = require('handlebars')
const isUtf8 = require('is-utf8')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

function split(word) {
	return word.split(/[-_\s]+/)
}

function space(word) {
	return split(trim(word)).join(' ')
}
Handlebars.registerHelper('space', space)

function trim(text) {
	return text.replace(/[\r\n]/g, '')
}
Handlebars.registerHelper('trim', trim)

function upper(text) {
	return trim(text).toUpperCase()
}
Handlebars.registerHelper('upper', upper)

function lower(text, options) {
	const space = options && options.hash && options.hash.space
	return trim(text).toLowerCase()
}
Handlebars.registerHelper('lower', lower)

function capital(text, options) {
	const space = options && options.hash && options.hash.space
	return split(trim(text))
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
		.join(space ? ' ' : '')
}
Handlebars.registerHelper('capital', capital)

function camel(text) {
	return capital(text).replace(/^./, (s) => s.toLowerCase())
}
Handlebars.registerHelper('camel', camel)

function snake(text) {
	return capital(text)
		.replace(/(?<=([a-z](?=[A-Z])|[A-Za-z](?=[0-9])))(?=[A-Z0-9])/g, '_')
		.toLowerCase()
}
Handlebars.registerHelper('snake', snake)

function kebab(text) {
	return snake(text).replace(/_/g, '-')
}
Handlebars.registerHelper('kebab', kebab)

function uuid() {
	return uuidv4()
}
Handlebars.registerHelper('uuid', uuid)

function format(text, view) {
	const template = Handlebars.compile(text.toString(), { noEscape: true })
	return template(view)
}

async function getAvailableTemplates(root, templatePrefix) {
	const prefixRegexp = new RegExp(`^${templatePrefix}`)
	return (await fs.readdir(root))
	.filter((d) => !d.startsWith('.') && d.startsWith(templatePrefix) && (d !== templatePrefix))
	.map(d => d.replace(prefixRegexp, ''))
}

async function walkDir(directory) {
	let fileList = []

	const files = await fs.readdir(directory)
	for (const file of files) {
		const p = path.join(directory, file)
		if ((await fs.stat(p)).isDirectory()) {
			fileList = [...fileList, ...(await walkDir(p))]
		} else {
			fileList.push(p)
		}
	}

	return fileList
}

async function prepareDirectory(filePath) {
	const target = path.dirname(filePath)
	try {
		await fs.mkdir(target, { recursive: true })
	} catch {
		throw new Error(`Cannot create directory with path ${target}`)
	}
}

async function copy(args) {
	const templateFiles = await walkDir(args.templateDir)
	for (const sourcePath of templateFiles) {
		const relativePath = path.relative(args.templateDir, sourcePath)
		const targetPath = format(
			path.resolve(args.projectDir, relativePath),
			args.view
		)
		await prepareDirectory(targetPath)

		let sourceData = await fs.readFile(sourcePath)
		let sourceStats = await fs.stat(sourcePath)
		let targetData = sourceData
		if (isUtf8(sourceData)) {
			targetData = Buffer.from(format(sourceData, args.view))
		}
		await fs.writeFile(targetPath, targetData, 'utf-8')

		var targetUnixFilePermissions = '0' + (sourceStats.mode & parseInt('777', 8)).toString(8);
		await fs.chmod(targetPath, targetUnixFilePermissions)
	}
}

module.exports = {getAvailableTemplates, copy}
