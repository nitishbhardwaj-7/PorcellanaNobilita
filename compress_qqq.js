const ffmpegPath = require('ffmpeg-static');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'images', 'Our story', 'qqq.mp4');
const outputPath = path.join(__dirname, 'public', 'images', 'Our story', 'qqq_compressed.mp4');

console.log('Input video:', inputPath);
console.log('Original Size:', (fs.statSync(inputPath).size / (1024 * 1024)).toFixed(2), 'MB');

// CRF 20 maintains high visual fidelity while reducing bitrate for smooth web playback.
// -movflags +faststart places moov atom at the front of the file so browsers stream instantly.
// -an strips unnecessary silent audio stream if present.
const cmd = `"${ffmpegPath}" -y -i "${inputPath}" -vcodec libx264 -crf 20 -preset medium -movflags +faststart -an "${outputPath}"`;

console.log('Running compression command...');
execSync(cmd, { stdio: 'inherit' });

const oldSizeMB = (fs.statSync(inputPath).size / (1024 * 1024)).toFixed(2);
const newSizeMB = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);
console.log(`Successfully compressed video!`);
console.log(`Original: ${oldSizeMB} MB -> Compressed: ${newSizeMB} MB`);
