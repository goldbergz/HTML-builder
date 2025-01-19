const fs = require('fs');
const path = require('path');

function copyDirectory() {

  const projectPath = path.join(__dirname, 'files');
  const copyPath = path.join(__dirname, 'files-copy');

  fs.mkdir(copyPath, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating directory:', err);
      return;
    }

    fs.readdir(copyPath, (err, files) => {
      if (err) {
        console.log('Error reading project directory:', err);
        return;
      }

      files.forEach(file => {
        fs.unlink(path.join(copyPath, file), (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        })
      })

      fs.readdir(projectPath, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.log('Error reading source directory:', err);
          return;
        }
  
        files.forEach(file => {
          const projectFilePath = path.join(projectPath, file.name);
          const copyFilePath = path.join(copyPath, file.name);

          fs.copyFile(projectFilePath, copyFilePath, (err) => {
            if (err) {
              console.error('Error copying file:', err);
            } else {
              console.log(`File copied: ${file.name}`);
            }
          })
        })
      })
    })
  });
}

copyDirectory();

