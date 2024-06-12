import _ from 'lodash';

const genDiff = (data1, data2) => {
  const keys = _.sortBy(Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)])));

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

export default genDiff;
