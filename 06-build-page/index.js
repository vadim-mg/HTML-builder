const fs = require('node:fs/promises');
const path = require('node:path');

const DIR_NAME = '06-build-page';
const ASSETS_DIR_NAME = 'assets';

const SRC_TEMPLATES_DIR = 'components';
const SRC_STYLES_DIR = 'styles';
const SRC_MAIN_TEMPLATE_FILE_NAME = 'template.html';

const DIST_DIR_NAME = 'project-dist';
const DIST_HTML_NAME = 'index.html';
const DIST_STYLES_FILE_NAME = 'style.css';

const makePath = (...paths) => path.normalize(path.join(DIR_NAME, ...paths));

const bundler = async (distDirName) => {
  const distDirPath = makePath(distDirName);
  const distAssetsPath = makePath(distDirName, ASSETS_DIR_NAME);
  const distHtmlPath = makePath(distDirName, DIST_HTML_NAME);
  const distStylesPath = makePath(distDirName, DIST_STYLES_FILE_NAME);

  const srcTemplatesPath = makePath(SRC_TEMPLATES_DIR);
  const srcMainTemplatePath = makePath(SRC_MAIN_TEMPLATE_FILE_NAME);
  const srcStylesPath = makePath(SRC_STYLES_DIR);

  console.log(distDirPath);
  console.log(distAssetsPath);
  console.log(distHtmlPath);
  console.log(distStylesPath);
  console.log(srcTemplatesPath);
  console.log(srcMainTemplatePath);
  console.log(srcStylesPath);


};

bundler(DIST_DIR_NAME);
