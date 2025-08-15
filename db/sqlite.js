'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../count-data');

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 生成文件路径
function getFilePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

// 获取单个计数
function getNum(name) {
  return new Promise((resolve, reject) => {
    const filePath = getFilePath(name);
    if (!fs.existsSync(filePath)) {
      return resolve({ name, num: 0 });
    }

    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      resolve({ name, num: data.num || 0 });
    } catch (err) {
      reject(err);
    }
  });
}

// 获取全部计数
function getAll() {
  return new Promise((resolve, reject) => {
    try {
      const files = fs.readdirSync(DATA_DIR);
      const all = files
          .filter(file => file.endsWith('.json'))
          .map(file => {
            const filePath = path.join(DATA_DIR, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return { name: path.basename(file, '.json'), num: data.num || 0 };
          });
      resolve(all);
    } catch (err) {
      reject(err);
    }
  });
}

// 设置单个计数
function setNum(name, num) {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(getFilePath(name), JSON.stringify({ num }, null, 2), 'utf8');
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

// 批量设置计数
function setNumMulti(counters) {
  return new Promise((resolve, reject) => {
    try {
      for (const counter of counters) {
        fs.writeFileSync(getFilePath(counter.name), JSON.stringify({ num: counter.num }, null, 2), 'utf8');
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getNum,
  getAll,
  setNum,
  setNumMulti
};
