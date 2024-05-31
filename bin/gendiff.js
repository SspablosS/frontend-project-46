#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';

const parseJsonFile = (filePath) => {
  const absolutePath = path.resolve(filePath);
  const fileData = fs.readFileSync(absolutePath, 'utf8');
  return JSON.parse(fileData);
};

program
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    const data1 = parseJsonFile(filepath1);
    const data2 = parseJsonFile(filepath2);
    console.log('File 1 data:', data1);
    console.log('File 2 data:', data2);
  })
  .parse(process.argv);
