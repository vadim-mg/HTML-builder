const fs = require('node:fs/promises');
const { createWriteStream } = require('node:fs');
const path = require('node:path');

const dirName = '05-merge-styles';
const srcDirName = 'styles';
const dstDirName = 'project-dist';

const srcDirPath = path.normalize(path.join(dirName, srcDirName));
const dstDirPath = path.normalize(path.join(dirName, dstDirName));

const bundler = async (srcPath, dstPath) => {
  try {
    const bundlePath = path.join(dstPath, 'bundle.css');
    await fs.rm(bundlePath, {
      force: true,
      recursive: true,
    });
    const bundleWriteStream = createWriteStream(bundlePath, {
      autoClose: true,
    });

    await fs
      .readdir(srcPath, {
        withFileTypes: true,
      })
      .then(async (files) => {
        for (const file of files) {
          if (file.isFile()) {
            const { ext } = path.parse(file.name);
            const filePath = path.join(file.path, file.name);
            if (ext === '.css') {
              const fd = await fs.open(filePath);
              const readStream = fd.createReadStream();

              readStream.on('data', (ch) => {
                bundleWriteStream.write(ch);
              });

              readStream.on('end', function () {
                fd.close();
              });

              readStream.on('error', function (err) {
                console.log(err.stack);
                fd.close();
              });
            }
          }
        }
      });
  } catch (err) {
    console.error(err);
  }
};

bundler(srcDirPath, dstDirPath);
