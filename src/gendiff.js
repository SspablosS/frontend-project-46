#!/usr/bin/env node

import { program } from 'commander';

program
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .parse(process.argv);

const filePath1 = program.args[0];
const filePath2 = program.args[1];
const outputFormat = program.format || 'default';

console.log('Filepath 1:', filePath1);
console.log('Filepath 2:', filePath2);
console.log('Output Format:', outputFormat);
