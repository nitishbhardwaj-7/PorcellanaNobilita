import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/Links/MEDICI VILLA copy (7).png';
    const image = await Jimp.read(imgPath);
    console.log('Dimensions:', image.width, 'x', image.height);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
