const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(projectDist, 'assets');
const distHTML = path.join(projectDist, 'index.html');
const distCSS = path.join(projectDist, 'style.css');

function ensureDirectory(dirPath, callback) {
  fs.mkdir(dirPath, { recursive: true }, (err) => {
    if (err) return callback(err);
    callback();
  });
}

function buildHTML(callback) {
  fs.readFile(templatePath, 'utf-8', (err, templateContent) => {
    if (err) return callback(err);

    const tagPattern = /{{\s*([a-zA-Z0-9_-]+)\s*}}/g;
    let finalHTML = templateContent;

    const matches = Array.from(templateContent.matchAll(tagPattern));
    if (matches.length === 0) {
      fs.writeFile(distHTML, finalHTML, callback);
      return;
    }

    let pending = matches.length;
    matches.forEach((match) => {
      const tagName = match[1];
      const componentFile = path.join(componentsPath, `${tagName}.html`);

      fs.readFile(componentFile, 'utf-8', (err, componentContent) => {
        if (!err) {
          finalHTML = finalHTML.replace(match[0], componentContent);
        } else {
          console.error(`Error reading component for tag {{${tagName}}}:`, err.message);
        }

        if (--pending === 0) {
          fs.writeFile(distHTML, finalHTML, callback);
        }
      });
    });
  });
}

function buildCSS(callback) {
  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) return callback(err);

    const cssFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');
    const writeStream = fs.createWriteStream(distCSS);

    let pending = cssFiles.length;

    cssFiles.forEach(file => {
      const filePath = path.join(stylesPath, file.name);
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.pipe(writeStream, { end: false });

      readStream.on('end', () => {
        if (--pending === 0) {
          writeStream.end();
          callback();
        }
      });

      readStream.on('error', (err) => {
        callback(err);
      });
    });

    if (cssFiles.length === 0) {
      writeStream.end();
      callback();
    }
  });
}

function copyAssets(src, dest, callback) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) return callback(err);

    fs.readdir(src, { withFileTypes: true }, (err, entries) => {
      if (err) return callback(err);

      let pending = entries.length;
      if (pending === 0) return callback();

      entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          copyAssets(srcPath, destPath, (err) => {
            if (err) return callback(err);
            if (--pending === 0) callback();
          });
        } else {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) return callback(err);
            if (--pending === 0) callback();
          });
        }
      });
    });
  });
}

function buildPage() {
  ensureDirectory(projectDist, (err) => {
    if (err) return console.error('Error creating directory:', err);

    buildHTML((err) => {
      if (err) return console.error('Error building HTML:', err);
    });

    buildCSS((err) => {
      if (err) return console.error('Error building CSS:', err);
    });

    copyAssets(assetsPath, distAssetsPath, (err) => {
      if (err) return console.error('Error copying assets:', err);
    });
  });
}

buildPage();
