const fs = require('fs');
const path = require('path');

const SOURCE_DIRS = ['Album 1', 'Instagram', 'WhatsApp'];
const TARGET_DIR = 'client/public/photos';
const LIST_FILE = 'client/src/photosList.json';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];

function setupPhotos() {
  const rootDir = __dirname;
  const targetPath = path.join(rootDir, TARGET_DIR);

  console.log(`Creating target directory: ${targetPath}`);
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  let copiedCount = 0;
  const photosList = [];

  for (const dirName of SOURCE_DIRS) {
    let sourcePath = path.join(rootDir, dirName);
    if (!fs.existsSync(sourcePath)) {
      sourcePath = path.join(rootDir, 'client', dirName);
    }
    if (!fs.existsSync(sourcePath)) {
      console.log(`Source directory does not exist: ${dirName}. Skipping.`);
      continue;
    }

    console.log(`Reading from: ${sourcePath}`);
    const files = fs.readdirSync(sourcePath);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        const fileSourcePath = path.join(sourcePath, file);
        const cleanName = `${dirName.replace(/\s+/g, '_')}_${file}`;
        const fileTargetPath = path.join(targetPath, cleanName);

        try {
          fs.copyFileSync(fileSourcePath, fileTargetPath);
          console.log(`Copied ${file} -> ${cleanName}`);
          copiedCount++;
          photosList.push(`/photos/${cleanName}`);
        } catch (err) {
          console.error(`Error copying file ${file}:`, err);
        }
      }
    }
  }

  // Write the photos array to photosList.json
  const listFilePath = path.join(rootDir, LIST_FILE);
  const listFileDir = path.dirname(listFilePath);
  if (!fs.existsSync(listFileDir)) {
    fs.mkdirSync(listFileDir, { recursive: true });
  }

  fs.writeFileSync(listFilePath, JSON.stringify(photosList, null, 2), 'utf8');
  console.log(`Finished copying. Total images in '${TARGET_DIR}': ${copiedCount}`);
  console.log(`Saved static photo list to '${LIST_FILE}'`);
}

setupPhotos();
