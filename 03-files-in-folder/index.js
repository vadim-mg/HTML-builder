const fs = require('node:fs/promises');
const path = require('node:path');

const dirName = __dirname;
const readDirName = 'secret-folder';

const readDirPath = path.normalize(path.join(dirName, readDirName));

try {
  fs.readdir(readDirPath, {
    withFileTypes: true,
  }).then(async (files) => {
    for (const file of files) {
      if (file.isFile()) {
        const { name, ext } = path.parse(file.name);
        const filePath = path.join(file.path, file.name);
        const { size } = await fs.stat(filePath);
        console.log(`${name} - ${ext.replace(/^\./, '')} - ${size}`);
      }
    }
  });
} catch (err) {
  console.error(err);
}
