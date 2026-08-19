import { Jimp } from 'jimp';

async function checkY() {
  const img = await Jimp.read('public/images/technical data/11.png');
  // find horizontal connector lines extending to the right around x = 400..700
  let rows = [];
  for (let y = 0; y < img.height; y++) {
    let count = 0;
    for (let x = 400; x < 700; x++) {
      if ((img.getPixelColor(x, y) & 0xff) > 50) {
        count++;
      }
    }
    if (count > 200) {
      rows.push(y);
    }
  }
  console.log('Horizontal connector rows:', rows);
}
checkY();
