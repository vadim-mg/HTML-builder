const fs = require('node:fs/promises');
const path = require('path');

const fileName = 'text.txt';

const filePath = path.join(__dirname, fileName);

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
  });
