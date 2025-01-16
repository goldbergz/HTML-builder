const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fileName = path.join(__dirname, 'output.txt');

const writeStream = fs.createWriteStream(fileName, { encoding: 'utf-8'});

process.stdin.setEncoding('utf-8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hello! Write your text here:');


rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Your text is written to a ', fileName);
    rl.close();
  } else {
    writeStream.write(`${input}\n`);
  }
})

rl.on('SIGINT', () => {
  console.log('Bye! Your text is written to a ', fileName);
  rl.close();
});

rl.on('close', () => {
  writeStream.end();
  process.exit(0);
})