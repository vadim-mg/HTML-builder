const fs = require('node:fs/promises');
const path = require('node:path');

const dirName = __dirname;
const srcDirName = 'files';
const dstDirName = 'files-copy';

const srcDirPath = path.normalize(path.join(dirName, srcDirName));
const dstDirPath = path.normalize(path.join(dirName, dstDirName));

const copyDir = async (srcPath, dstPath) => {
  try {
    await fs.rm(dstPath, {
      force: true,
      recursive: true,
    });
    await fs.mkdir(dstPath, {
      recursive: true,
    });
    fs.readdir(srcPath, {
      withFileTypes: true,
    }).then(async (files) => {
      for (const file of files) {
        await fs.copyFile(
          path.join(file.path, file.name),
          path.join(dstPath, file.name),
        );
      }
    });
  } catch (err) {
    console.error(err);
  }
};

copyDir(srcDirPath, dstDirPath);
