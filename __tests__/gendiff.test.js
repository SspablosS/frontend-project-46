/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { genDiff } from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('genDiff with flat JSON files', () => {
  const filePath1 = path.resolve(__dirname, '../file1.json');
  const filePath2 = path.resolve(__dirname, '../file2.json');

  const data1 = JSON.parse(fs.readFileSync(filePath1, 'utf-8'));
  const data2 = JSON.parse(fs.readFileSync(filePath2, 'utf-8'));

  const expectedOutput = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

  expect(genDiff(data1, data2)).toBe(expectedOutput);
});
