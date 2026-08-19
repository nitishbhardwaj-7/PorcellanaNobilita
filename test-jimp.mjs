import { Jimp } from 'jimp';
import fs from 'fs';

async function run() {
  try {
    const imgPath = 'public/images/made-in-italy/Colosseo_2020 copy.jpg';
    const image = await Jimp.read(imgPath);
    console.log('Original dimensions:', image.width, 'x', image.height);
    
    // Experiment: Original dimensions, quality 60
    {
      const out = 'public/images/made-in-italy/colosseo-original-q60.jpg';
      await image.write(out, { quality: 60 });
      const stats = fs.statSync(out);
      console.log('Original size, quality 60:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
    }

    // Experiment: Original dimensions, quality 50
    {
      const out = 'public/images/made-in-italy/colosseo-original-q50.jpg';
      await image.write(out, { quality: 50 });
      const stats = fs.statSync(out);
      console.log('Original size, quality 50:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
