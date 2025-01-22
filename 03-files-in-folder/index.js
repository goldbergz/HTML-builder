const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
    return;
  }
  files.forEach(file => {
    if (file.isFile()) {
      const fullPath = path.join(dirPath, file.name);

      fs.stat(fullPath, (err, stats) => {
        if (err) {
          console.log(err);
          return;
        }

        let fileName = path.parse(file.name).name;
        let fileExt = path.parse(file.name).ext.slice(1);

        if (!fileExt && file.name.startsWith('.')) {
          fileName = '';
          fileExt = file.name.slice(1);
        }

        const fileSizeKB = stats.size / 1024;
        console.log(`${fileName} - ${fileExt} - ${fileSizeKB}kb`);
      });
    }
  });
});
