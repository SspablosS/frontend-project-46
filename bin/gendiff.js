#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const parseJsonFile = (filePath) => {
  const absolutePath = path.resolve(filePath);
  const fileData = fs.readFileSync(absolutePath, 'utf8');
  return JSON.parse(fileData);
};

const genDiff = (data1, data2) => {
  const keys = _.sortBy(
    Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)]))
  );

  const result = keys.map((key) => {
    if (!(key in data2)) {
      return `  - ${key}: ${data1[key]}`;
    }
    if (!(key in data1)) {
      return `  + ${key}: ${data2[key]}`;
    }
    if (data1[key] !== data2[key]) {
      return `  - ${key}: ${data1[key]}\n  + ${key}: ${data2[key]}`;
    }
    return `    ${key}: ${data1[key]}`;
  });

  return `{\n${result.join('\n')}\n}`;
};

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
