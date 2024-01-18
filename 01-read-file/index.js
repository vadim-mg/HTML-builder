const fs = require('node:fs/promises');
const path = require('path');

const dirName = '01-read-file';
const fileName = 'text.txt';

const filePath = path.normalize(path.join(dirName, fileName));

fs.open(filePath, 'r')
  .then((fd) => {
    const readStream = fd.createReadStream();

    let data = '';

    readStream.on('data', (ch) => {
      data += ch;
    });

    readStream.on('end', function () {
      console.log(data);
      fd.close();
    });

    readStream.on('error', function (err) {
      console.log(err.stack);
      fd.close();
    });
  })
  .catch((err) => {
    console.error(err.stack);
    if (process.cwd().indexOf(dirName) > 0) {
      console.log(
        `Script must be executed in the root directory(HTML-BUILDER) using the command "node ${dirName}"!!!`,
      );
    }
  });
