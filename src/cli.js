#!/usr/bin/env node

/* global __dirname */

const chalk = require('chalk')
const { resolve } = require('path')
const { create } = require('./index.js')

const templateRoot = resolve(__dirname, '..', 'templates')
const caveat = ({ name, template }) => {
	let text = `
cd ${chalk.bold.green(name)}
`

	switch (template) {
		case 'typescript':
			text += `
Inside the directory, you can run several commands:

${chalk.bold.cyan('npm run dev')}
	${chalk.gray("Starts 'tsc -w'.")}
${chalk.bold.cyan('npm run build')}
	${chalk.gray('Build the app for production.')}

After the build, run ${chalk.cyan(
				'node dist/cli.js <name>'
			)} to test your app.
`
			break
		default:
			text += `node src/cli.js <name>
`
	}

	text += `
Read the docs for further information:
${chalk.yellow(
	'https://github.com/ClassicOldSong/create-initializer/blob/master/README.md'
)}`

	return text
}

create('create-initializer', {
	templateRoot,
	promptForTemplate: true,
	defaultTemplate: 'javascript',
	templatePrefix: 'template-',
	modifyName: name => (name.startsWith('create-') ? name : `create-${name}`),
	caveat,
})
