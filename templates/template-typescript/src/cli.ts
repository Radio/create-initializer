#!/usr/bin/env node

import { create } from 'create-initializer';
import { resolve } from 'path';

const templateRoot = resolve(__dirname, '..', 'templates');

const caveat = `
This is a caveat!
You can change this in \`src/cli.ts\`.
`;

// See https://github.com/ClassicOldSong/create-initializer/blob/master/README.md for the full option list.

create('{{kebab name}}', {
  templateRoot,
  defaultTemplate: 'my-template',
  templatePrefix: 'template-',
  extra: {
    architecture: {
      type: 'list',
      describe: 'choose your fave os',
      choices: ['macOS', 'Windows', 'Linux'],
      prompt: 'if-no-arg',
    },
  },
  after: ({ answers }) => console.log(`Ok you chose ${answers.architecture}.`),
  caveat,
});
