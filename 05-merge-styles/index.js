const fs = require('fs');
const path = require('path');

const mergeStyles = () => {
  const stylesDir = path.join(__dirname, 'styles');
  const outputDir = path.join(__dirname, 'project-dist');
  const outputFile = path.join(outputDir, 'bundle.css');
  
  fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading styles directory:', err);
      return;
    }
    const styleFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');
    const writeStream = fs.createWriteStream(outputFile);
    
    styleFiles.forEach(file => {
      const filePath = path.join(stylesDir, file.name);

      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.pipe(writeStream, { end: false });

      readStream.on('error', (err) => {
        console.error(`Error reading file ${file.name}:`, err);
      });

      readStream.on('end', () => {
        console.log(`Added ${file.name} to bundle.css`);
      });
    });

    writeStream.on('finish', () => {
      console.log('bundle.css created successfully!');
    });

    writeStream.on('error', (err) => {
      console.error('Error writing to bundle.css:', err);
    });
  });
};

mergeStyles();
