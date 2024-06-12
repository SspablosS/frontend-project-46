/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import genDiff from '../src/gendiff';
import parseFile from '../src/parsers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const dataTypes = [
  {
    ext: 'json', parse: JSON.parse, validContent: { key1: 'value1', key2: 'value2' }, invalidContent: '{ key1: "value1", key2: "value2"',
  },
  {
    ext: 'yaml', parse: yaml.load, validContent: { key1: 'value1', key2: 'value2' }, invalidContent: 'key1 value1\nkey2: value2',
  },
];

dataTypes.forEach(({
  ext, parse, validContent, invalidContent,
}) => {
  test(`genDiff with flat ${ext.toUpperCase()} files`, () => {
    const data1 = parse(readFile(`file1.${ext}`));
    const data2 = parse(readFile(`file2.${ext}`));

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

  test(`parseFile with valid ${ext.toUpperCase()}`, () => {
    const filePath = getFixturePath(`valid.${ext}`);
    fs.writeFileSync(filePath, ext === 'json' ? JSON.stringify(validContent) : yaml.dump(validContent));

    const parsedData = parseFile(filePath);
    expect(parsedData).toEqual(validContent);

    fs.unlinkSync(filePath);
  });

  test(`parseFile with invalid ${ext.toUpperCase()}`, () => {
    const filePath = getFixturePath(`invalid.${ext}`);
    fs.writeFileSync(filePath, invalidContent);

    if (ext === 'json') {
      expect(() => parseFile(filePath)).toThrow(SyntaxError);
    } else if (ext === 'yaml') {
      expect(() => parseFile(filePath)).toThrowError(/expected/);
    }

    fs.unlinkSync(filePath);
  });
});

const testCases = [
  {
    name: 'with two empty objects (JSON)',
    data1: {},
    data2: {},
    expected: '{\n\n}',
  },
  {
    name: 'with added keys (JSON)',
    data1: {},
    data2: { key1: 'value1', key2: 'value2' },
    expected: '{\n  + key1: value1\n  + key2: value2\n}',
  },
  {
    name: 'with removed keys (JSON)',
    data1: { key1: 'value1', key2: 'value2' },
    data2: {},
    expected: '{\n  - key1: value1\n  - key2: value2\n}',
  },
  {
    name: 'with modified keys (JSON)',
    data1: { key1: 'value1', key2: 'value2' },
    data2: { key1: 'value1', key2: 'value3' },
    expected: '{\n    key1: value1\n  - key2: value2\n  + key2: value3\n}',
  },
  {
    name: 'with unchanged keys (JSON)',
    data1: { key1: 'value1', key2: 'value2' },
    data2: { key1: 'value1', key2: 'value2' },
    expected: '{\n    key1: value1\n    key2: value2\n}',
  },
  {
    name: 'with a mix of changes (JSON)',
    data1: { key1: 'value1', key2: 'value2', key3: 'value3' },
    data2: { key2: 'value2', key3: 'value4', key4: 'value5' },
    expected: '{\n  - key1: value1\n    key2: value2\n  - key3: value3\n  + key3: value4\n  + key4: value5\n}',
  },

  {
    name: 'with two empty objects (YAML)',
    data1: {},
    data2: {},
    expected: '{\n\n}',
    isYAML: true,
  },
  {
    name: 'with added keys (YAML)',
    data1: {},
    data2: { key1: 'value1', key2: 'value2' },
    expected: '{\n  + key1: value1\n  + key2: value2\n}',
    isYAML: true,
  },
  {
    name: 'with removed keys (YAML)',
    data1: { key1: 'value1', key2: 'value2' },
    data2: {},
    expected: '{\n  - key1: value1\n  - key2: value2\n}',
    isYAML: true,
  },
  {
    name: 'with modified keys (YAML)',
    data1: { key1: 'value1', key2: 'value2' },
    data2: { key1: 'value1', key2: 'value3' },
    expected: '{\n    key1: value1\n  - key2: value2\n  + key2: value3\n}',
    isYAML: true,
  },
  {
    name: 'with unchanged keys (YAML)',
    data1: { key1: 'value1', key2: 'value2' },
    data2: { key1: 'value1', key2: 'value2' },
    expected: '{\n    key1: value1\n    key2: value2\n}',
    isYAML: true,
  },
  {
    name: 'with a mix of changes (YAML)',
    data1: { key1: 'value1', key2: 'value2', key3: 'value3' },
    data2: { key2: 'value2', key3: 'value4', key4: 'value5' },
    expected: '{\n  - key1: value1\n    key2: value2\n  - key3: value3\n  + key3: value4\n  + key4: value5\n}',
    isYAML: true,
  },
];

testCases.forEach(({
  name, data1, data2, expected, isYAML,
}) => {
  const ext = isYAML ? 'yaml' : 'json';
  test(`genDiff ${name} (${ext.toUpperCase()})`, () => {
    expect(genDiff(data1, data2)).toBe(expected);
  });
});
