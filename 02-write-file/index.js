const process = require('node:process');
const readline = require('readline');
const fs = require('node:fs');
const path = require('node:path');

const dirName = __dirname;
const fileName = 'text.txt';

const filePath = path.normalize(path.join(dirName, fileName));
const writeStream = fs.createWriteStream(filePath, { autoClose: true });

let rl = readline.createInterface(process.stdin, process.stdout);

rl.on('close', () => {
  console.log('Good bye!');
  writeStream.close();
});

rl.setPrompt('enter text here: ');
rl.prompt();

rl.on('line', (inputText) => {
  if (inputText.toLowerCase() === 'exit') {
    rl.close();
    return;
  }
  writeStream.write(inputText + '\n');
  rl.prompt();
});
