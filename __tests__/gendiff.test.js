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

test('genDiff with two empty objects', () => {
  const data1 = {};
  const data2 = {};
  const expected = '{\n\n}';
  expect(genDiff(data1, data2)).toBe(expected);
});

test('genDiff with added keys', () => {
  const data1 = {};
  const data2 = { key1: 'value1', key2: 'value2' };
  const expected = '{\n  + key1: value1\n  + key2: value2\n}';
  expect(genDiff(data1, data2)).toBe(expected);
});

test('genDiff with removed keys', () => {
  const data1 = { key1: 'value1', key2: 'value2' };
  const data2 = {};
  const expected = '{\n  - key1: value1\n  - key2: value2\n}';
  expect(genDiff(data1, data2)).toBe(expected);
});

test('genDiff with modified keys', () => {
  const data1 = { key1: 'value1', key2: 'value2' };
  const data2 = { key1: 'value1', key2: 'value3' };
  const expected = '{\n    key1: value1\n  - key2: value2\n  + key2: value3\n}';
  expect(genDiff(data1, data2)).toBe(expected);
});

test('genDiff with unchanged keys', () => {
  const data1 = { key1: 'value1', key2: 'value2' };
  const data2 = { key1: 'value1', key2: 'value2' };
  const expected = '{\n    key1: value1\n    key2: value2\n}';
  expect(genDiff(data1, data2)).toBe(expected);
});

test('genDiff with a mix of changes', () => {
  const data1 = { key1: 'value1', key2: 'value2', key3: 'value3' };
  const data2 = { key2: 'value2', key3: 'value4', key4: 'value5' };
  const expected = '{\n  - key1: value1\n    key2: value2\n  - key3: value3\n  + key3: value4\n  + key4: value5\n}';
  expect(genDiff(data1, data2)).toBe(expected);
});
