<div align="center">
<h1 align="center">✨ Create Initializer</h1>
<h6>Create your own `create-something` app.</h6>
<br/>
</div>

## NOTE

This is a forked and modified version of [create-create-app](https://github.com/uetchy/create-create-app). Modifications may be differ from the initial design of the original project so this will not be merged to the upstream and will be made into a seperate package.

## Why?

- ⚖️ **Built-in License selector** No need to manually add license things.
- 🎩 **Template engine** [Mustache](https://github.com/janl/mustache.js) will do things all.
- 💄 **Highly customizable** Changable caveat text, and add extra cli options.

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Quick Start](#quick-start)
  - [1. `npm create initializer`](#1-npm-create-initializer)
  - [2. Edit templates](#2-edit-templates)
    - [TypeScript](#typescript)
  - [3. Publish package to npm](#3-publish-package-to-npm)
  - [4. PROFIT!](#4-profit)
- [Template](#template)
  - [Adding a template](#adding-a-template)
  - [Helper functions](#helper-functions)
    - [`upper`](#upper)
    - [`lower`](#lower)
    - [`capital`](#capital)
    - [`camel`](#camel)
    - [`snake`](#snake)
    - [`kebab`](#kebab)
    - [`space`](#space)
    - [`uuid`](#uuid)
- [Config](#config)
  - [templateRoot (required)](#templateroot-required)
  - [templatePrefix (default: `<empty string>`)](#templateprefix-default-empty-string)
  - [promptForTemplate (default: `false`)](#promptfortemplate-default-false)
  - [defaultTemplate (default: `default`)](#defaulttemplate-default-default)
  - [extra (default: `undefined`)](#extra-default-undefined)
  - [modifyName (default: `undefined`)](#modifyname-default-undefined)
  - [after (default: `undefined`)](#after-default-undefined)
  - [caveat (default: `undefined`)](#caveat-default-undefined)
  - [AfterHookOptions](#afterhookoptions)
- [Contribution](#contribution)
  - [Contributors ✨](#contributors-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Quick Start

Let's create `create-greet` package in four steps.

### 1. `npm create initializer`

```shell
npm create initializer greet
```

or if you use `yarn`, then run `yarn create initializer greet`

![screenshot](https://raw.githubusercontent.com/uetchy/create-create-app/master/.github/assets/ss1.png)

### 2. Edit templates

`cd create-greet` and edit files inside `templates/default`.

#### TypeScript

Run `npm run build` or `yarn build` to transpile TypeScript code into JavaScript.

### 3. Publish package to npm

Run `npm publish` or `yarn publish` to publish your `create-greet` app to npm.

### 4. PROFIT!

```bash
npm create greet ohayo
```

![screenshot](https://raw.githubusercontent.com/uetchy/create-create-app/master/.github/assets/ss2.png)

## Template

Edit files inside `templates/default`. File names, directory names, and text files will be processed through Handlebars template engine to replace all template strings with respective value.

Built-in variables are:

- `{{name}}` package name
- `{{description}}` package description
- `{{author}}` author name
- `{{email}}` author email
- `{{contact}}` author name formatted with `{{name}} <{{email}}>` if email given, otherwise `{{name}}`
- `{{license}}` package license (e.g. `MIT`)
- `{{year}}` current year (e.g. `2020`)

### Adding a template

Add new directory to the location defined in `templateRoot`; it will be accessible in `--template` flag (e.g. `create-something <name> --template <template>`).
Besides, set `promptForTemplate` true to explicitly ask users to pick a template in initialization phase, otherwise `default` will be used.

### Helper functions

In the following example, we assume that variable `name` is `create-react-app`.

#### `upper`

Output text in UPPERCASE.

`{{upper name}}` becomes `CREATE-REACT-APP`.

#### `lower`

Output text in lowercase.

`{{lower name}}` becomes `create-react-app`.

#### `capital`

Output text in CapitalCase.

- `{{capital name}}` becomes `CreateReactApp`
- `{{capital name space=true}}` becomes `Create React App`.

#### `camel`

Output text in camelCase.

`{{camel name}}` becomes `createReactApp`.

#### `snake`

Output text in snake_case.

`{{snake name}}` becomes `create_react_app`.

#### `kebab`

Output text in kebab-case.

`{{kebab name}}` becomes `create-react-app`.

#### `space`

Replace all word separators with single space.

`{{space name}}` becomes `create react app`

#### `uuid`

Generates unique UUID string.

```
{{uuid}} // => a5df7100-da46-47a6-907e-afe861f48b39
{{upper (uuid)}} // => A5DF7100-DA46-47A6-907E-AFE861F48B39
```

## Config

You can find the app config in `src/cli.js` (or `src/cli.ts` if you chose `typescript` template).

```ts
import { resolve } from 'path';
import { create } from 'create-initializer';

create('create-greet', {
  templateRoot: resolve(__dirname, '..', 'templates'),
  defaultTemplate: 'my-template',
  templatePrefix: 'template-',
  useYarn: true,
  extra: {
    language: {
      type: 'input',
      describe: 'greeting language',
      default: 'en',
      prompt: 'if-no-arg',
    },
  },
  modifyName: (name) => `package-prefix-${name}`,
  after: ({ installNpmPackage }) => installNpmPackage('chalk'),
  caveat: `Your app has been created successfully!`,
});
```

### templateRoot (required)

`templateRoot` set to `path.resolve(__dirname, '../templates')`. You can change it to whereever you want.

### templatePrefix (default: `<empty string>`)

Set the prefix for template folder. Template prefix will be removed when displaying choices for the template.

For example: we have a template folder named `template-awesome`, we set `templatePrefix` to `template-`, then

```
create-something <name> --template awesome
```
will copy `template-awesome` to the destination dir.

### promptForTemplate (default: `false`)

Ask users to choose a template to be used for initialization only if `promptForTemplate` is set `true` AND there's multiple templates found in `templates/`.

With `promptForTemplate` set `false`, users still can specify template via command-line flag `--template`:

```
create-something <name> --template <template>
```

### defaultTemplate (default: `default`)

Set the default template choice. Works both when `promptForTemplate` is `true` or `false`.

### useYarn (default: `true`)

Prefer `yarn` over `npm`. NPM will still be used if Yarn is not available. 

### extra (default: `undefined`)

`object | undefined`

Extra options passed to the app. These options will be accessible as a cli option, interactive question, and template string. In this case, `--language` cli option and `{{language}}` template string will be available.

You can find all possible options in [yargs-interactive documentation](https://github.com/nanovazquez/yargs-interactive#options).

### modifyName (default: `undefined`)

`(name: string) => string | Promise<string>`

Modify `name` property.

### after (default: `undefined`)

`(options: AfterHookOptions) => void`

After hook script that runs after the initialization.

### caveat (default: `undefined`)

`string | ((options: AfterHookOptions) => string | void) | undefined`

The caveat message will be shown after the entire process completed.

```js
create('create-greet', {
  caveat: 'Happy coding!',
});
```

```js
create('create-greet', {
  caveat: ({ answers }) => `Run -> cd ${answers.name} && make`,
});
```

```js
create('create-greet', {
  caveat: async ({ packageDir, answers }) => {
    const { plugin } = answers;
    await execa('npm', ['install', '--prefix', packageDir, '-S', plugin]);
    console.log(`"${plugin}" has been added`);
  },
});
```

### AfterHookOptions

```typescript
{
  // variables
  packageDir: string;
  templateDir: string;
  year: number; // 2020
  answers: {
    name: string; // package name
    description: string; // description
    author: string; // John Doe
    email: string; // john@example.com
    contact: string; // John Doe <john@example.com>
    license: string; // MIT
    [key: string]: string | number | boolean | any[]; // any values defined in the `extra` field.
  };
  // functions
  run: (command: string, options?: CommonOptions<string>) => ExecaChildProcess<string>; // run shell command in the package dir
  installNpmPackage: (packageName: string) => Promise<void>; // use yarn if available
}
```

## Contribution

PRs are always welcome!
