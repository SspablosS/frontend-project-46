#!/usr/bin/env node
/* eslint-disable import/extensions */
/* eslint-disable no-console */

import { Command } from 'commander';
import genDiff from '../src/gendiff.js';
import parseFile from '../src/parsers.js';

const program = new Command();

program
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    const data1 = parseFile(filepath1);
    const data2 = parseFile(filepath2);
    const diff = genDiff(data1, data2);
    console.log(diff);
  })
  .parse(process.argv);
