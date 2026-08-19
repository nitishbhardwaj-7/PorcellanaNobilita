import { Jimp } from 'jimp';
import fs from 'fs';

async function run() {
  try {
    const sourcePath = 'public/images/made-in-italy/Colosseo_2020 copy.jpg';
    const targetPath = 'public/images/made-in-italy/colosseo-2020.jpg';
    const backupPath = 'public/images/made-in-italy/colosseo-2020-old.jpg';

    if (!fs.existsSync(sourcePath)) {
      console.error(`Error: Source image not found at ${sourcePath}`);
      return;
    }

    console.log(`Reading source image: ${sourcePath}...`);
    const image = await Jimp.read(sourcePath);
    console.log(`Original dimensions: ${image.width} x ${image.height}`);

    // Backup the existing colosseo-2020.jpg if we haven't already
    if (fs.existsSync(targetPath) && !fs.existsSync(backupPath)) {
      console.log(`Backing up original colosseo-2020.jpg to ${backupPath}...`);
      fs.renameSync(targetPath, backupPath);
    } else if (fs.existsSync(targetPath)) {
      console.log(`Removing old target image at ${targetPath}...`);
      fs.unlinkSync(targetPath);
    }

    // Resize to 2560px width for premium clarity (reduces dimensions by ~63%)
    console.log('Resizing to 2560px width...');
    const resized = image.resize({ w: 2560 });

    // Write compressed file
    console.log(`Writing compressed image to ${targetPath} (quality: 75)...`);
    await resized.write(targetPath, { quality: 75 });

    const stats = fs.statSync(targetPath);
    console.log(`\nSuccess! Compressed Colosseum image saved.`);
    console.log(`New Dimensions: ${resized.width} x ${resized.height}`);
    console.log(`New File Size: ${(stats.size / 1024).toFixed(1)} KB (down from 5.3 MB)`);
  } catch (err) {
    console.error('Error during image processing:', err);
  }
}

run();
