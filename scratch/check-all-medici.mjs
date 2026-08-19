import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

async function run() {
  const dir = 'public/images/Links';
  const files = fs.readdirSync(dir).filter(f => f.includes('MEDICI VILLA'));
  for (const f of files) {
    try {
      const imgPath = path.join(dir, f);
      const image = await Jimp.read(imgPath);
      console.log(f, ':', image.width, 'x', image.height, `(size: ${fs.statSync(imgPath).size} bytes)`);
    } catch (err) {
      console.error('Error reading', f, ':', err.message);
    }
  }
}

run();
