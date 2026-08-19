const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'public', 'images', 'Links'),
  path.join(__dirname, 'public', 'images')
];

async function compressImage(filePath) {
  try {
    const stat = fs.statSync(filePath);
    const sizeInMB = stat.size / (1024 * 1024);
    
    // Only compress if the file is larger than 250KB
    if (stat.size < 250 * 1024) {
      console.log(`Skipping ${path.basename(filePath)} (${(stat.size / 1024).toFixed(1)} KB)`);
      return;
    }

    console.log(`Processing ${path.basename(filePath)} (${sizeInMB.toFixed(2)} MB)...`);
    
    const fileBuffer = await fs.promises.readFile(filePath);
    const image = await Jimp.fromBuffer(fileBuffer, {
      "image/jpeg": {
        maxMemoryUsageInMB: 4096
      }
    });
    const w = image.width;
    const h = image.height;
    
    // If image is very high res (e.g. width/height > 1920), resize it to be max 1920px to save memory
    if (w > 1920 || h > 1920) {
      if (w > h) {
        image.resize({ w: 1920 });
      } else {
        image.resize({ h: 1920 });
      }
      console.log(`Resized ${path.basename(filePath)} to 1920px max dimension`);
    }
    
    // Determine MIME type
    const ext = path.extname(filePath).toLowerCase();
    let mime = 'image/jpeg';
    let options = {};
    if (ext === '.png') {
      mime = 'image/png';
    } else {
      options = { quality: 75 }; // 75% quality is visually indistinguishable but highly compressed
    }
    
    // Compress and write back using buffer
    const buffer = await image.getBuffer(mime, options);
    await fs.promises.writeFile(filePath, buffer);
    
    const newStat = fs.statSync(filePath);
    const newSizeInKB = newStat.size / 1024;
    console.log(`Compressed ${path.basename(filePath)} from ${sizeInMB.toFixed(2)} MB to ${newSizeInKB.toFixed(1)} KB`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

function getFiles(dirPath) {
  let results = [];
  if (!fs.existsSync(dirPath)) return results;
  const list = fs.readdirSync(dirPath);
  list.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        results.push(filePath);
      }
    }
  });
  return results;
}

async function run() {
  let allFiles = [];
  for (const dir of dirs) {
    allFiles = allFiles.concat(getFiles(dir));
  }
  
  // Deduplicate files
  allFiles = [...new Set(allFiles)];
  
  console.log(`Found ${allFiles.length} images. Starting compression...`);
  for (const file of allFiles) {
    await compressImage(file);
  }
  console.log("Image compression complete!");
}

run();
