const process = require('node:process');
const readline = require('readline');
const fs = require('node:fs');
const path = require('node:path');

const dirName = '02-write-file';
const fileName = 'text.txt';

const filePath = path.normalize(path.join(dirName, fileName));
const fd = fs.createWriteStream(filePath, { autoClose: true });

let rl = readline.createInterface(process.stdin, process.stdout);

rl.on('close', () => {
  console.log('Good bye!');
  fd.close();
});

rl.setPrompt('enter text here: ');
rl.prompt();

rl.on('line', (inputText) => {
  if (inputText.toLowerCase() === 'exit') {
    rl.close();
    return;
  }
  fd.write(inputText);
  rl.prompt();
});
