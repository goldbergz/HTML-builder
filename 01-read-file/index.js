const fs = require('fs');
const path = require('path');

const fileName = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(fileName, { encoding: 'utf-8' });
let data = '';
readableStream.on('data', (chunk) => console.log(data += chunk))

