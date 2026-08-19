import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/Links/MEDICI VILLA copy (7).png';
    const original = await Jimp.read(imgPath);

    // Crop a vertical strip (9:16 aspect ratio) centered around the building's true center of symmetry (X = 982)
    const cropH = original.height; // 945
    const cropW = Math.round(cropH * (9 / 16)); // ~531
    
    const centerAxisX = 982;
    const cropX = centerAxisX - Math.round(cropW / 2); // 982 - 266 = 716
    const cropY = 0;

    console.log(`Cropping original image at X: [${cropX}, ${cropX + cropW}] Y: [0, ${cropH}]`);

    const cropped = original.crop({ x: cropX, y: cropY, w: cropW, h: cropH });

    // Save to the mobile image path
    const outputPath = 'public/images/Links/medici-villa-mobile.png';
    await cropped.write(outputPath);
    console.log(`Successfully generated zoomed-and-centered mobile portrait image at ${outputPath}`);
  } catch (err) {
    console.error('Error generating image:', err);
  }
}

run();
