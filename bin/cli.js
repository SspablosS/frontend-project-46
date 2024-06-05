#!/usr/bin/env node
/* eslint-disable no-console */

import { program } from 'commander';
// eslint-disable-next-line import/extensions
import parseJsonFile, { genDiff } from '../src/gendiff.js';

program
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    const data1 = parseJsonFile(filepath1);
    const data2 = parseJsonFile(filepath2);
    const diff = genDiff(data1, data2);
    console.log(diff);
  })
  .parse(process.argv);
