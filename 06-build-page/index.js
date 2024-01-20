const fs = require('node:fs/promises');
const path = require('node:path');
const { createWriteStream } = require('node:fs');

const DIR_NAME = '06-build-page';
const ASSETS_DIR_NAME = 'assets';

const SRC_TEMPLATES_DIR = 'components';
const SRC_STYLES_DIR = 'styles';
const SRC_MAIN_TEMPLATE_FILE_NAME = 'template.html';

const DIST_DIR_NAME = 'project-dist';
const DIST_HTML_NAME = 'index.html';
const DIST_STYLES_FILE_NAME = 'style.css';

const makePath = (...paths) => path.normalize(path.join(DIR_NAME, ...paths));

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
        const srcFilePath = path.join(file.path, file.name);
        const dstFilePath = path.join(dstPath, file.name);
        if (file.isFile()) {
          await fs.copyFile(srcFilePath, dstFilePath);
        } else if (file.isDirectory) {
          await copyDir(srcFilePath, dstFilePath);
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
};

const mergeStyles = async (srcPath, dstPath) => {
  try {
    await fs.rm(dstPath, {
      force: true,
      recursive: true,
    });
    const bundleWriteStream = createWriteStream(dstPath, {
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

const readHtml = async (filePath) => {
  const fd = await fs.open(filePath, 'r');

  return new Promise((res, rej) => {
    const readStream = fd.createReadStream();

    let data = '';

    readStream.on('data', (ch) => {
      data += ch;
    });

    readStream.on('end', function () {
      fd.close();
      return res(data);
    });

    readStream.on('error', function (err) {
      // console.log(err.stack);
      fd.close();
      return rej(err);
    });
  });
};

const bundler = async (distDirName) => {
  const distDirPath = makePath(distDirName);
  const distAssetsPath = makePath(distDirName, ASSETS_DIR_NAME);
  const distHtmlPath = makePath(distDirName, DIST_HTML_NAME);
  const distStylesPath = makePath(distDirName, DIST_STYLES_FILE_NAME);

  const srcTemplatesPath = makePath(SRC_TEMPLATES_DIR);
  const srcMainTemplatePath = makePath(SRC_MAIN_TEMPLATE_FILE_NAME);
  const srcStylesPath = makePath(SRC_STYLES_DIR);
  const srcAssetsPath = makePath(ASSETS_DIR_NAME);

  try {
    /* Create dist folder */
    await fs.rm(distDirPath, {
      force: true,
      recursive: true,
    });
    fs.mkdir(distDirPath, { recursive: true });

    /* Copy Assets */
    await copyDir(srcAssetsPath, distAssetsPath);

    /* Merge styles */
    await mergeStyles(srcStylesPath, distStylesPath);

    /* read html template */
    let html = await readHtml(srcMainTemplatePath);

    /* replase templates */
    const templateNames = html
      .match(/\{\{[a-z]+\}\}/g)
      .map((val) => val.replace(/\{\{(.+)\}\}/, '$1'));
    await Promise.allSettled(
      templateNames.map(async (templateName) => {
        const htmlPath = path.join(srcTemplatesPath, `${templateName}.html`);
        const templateHtml = await readHtml(htmlPath);
        html = html.replace(`{{${templateName}}}`, templateHtml);
      }),
    );

    /* write new html */
    const writeStream = createWriteStream(distHtmlPath, {
      autoClose: true,
    });
    writeStream.write(html);
    writeStream.close();
  } catch (err) {
    console.error(err);
    return err;
  }
};

bundler(DIST_DIR_NAME);
