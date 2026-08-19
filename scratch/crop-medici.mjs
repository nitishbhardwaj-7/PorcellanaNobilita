import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/Links/MEDICI VILLA copy (7).png';
    const image = await Jimp.read(imgPath);
    
    // We want a portrait version. Let's do a crop centered horizontally.
    // Original dimensions: 1920 x 945
    // Let's create a mobile version with width = 640, height = 945.
    const cropWidth = 640;
    const cropHeight = 945;
    const x = Math.round((image.width - cropWidth) / 2);
    const y = 0;
    
    const cropped = image.crop({ x, y, w: cropWidth, h: cropHeight });
    
    const outputPath = 'public/images/Links/MEDICI VILLA mobile.png';
    await cropped.write(outputPath);
    console.log(`Successfully cropped and saved to ${outputPath}. Dimensions: ${cropWidth} x ${cropHeight}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
