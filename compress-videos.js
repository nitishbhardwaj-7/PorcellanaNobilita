const ffmpegPath = require('ffmpeg-static');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const videos = [
  path.join(__dirname, 'public', 'images', 'Links', 'Calacatta Oyster Vid.mp4'),
  path.join(__dirname, 'public', 'images', 'Links', 'arbescato vagli bathroom video.mp4'),
  path.join(__dirname, 'public', 'images', 'Links', 'materials.mp4'),
  path.join(__dirname, 'public', 'images', 'Links', 'Applications.mp4')
];

function compressVideo(inputPath) {
  if (!fs.existsSync(inputPath)) {
    console.log(`Video not found: ${inputPath}`);
    return;
  }
  
  const stat = fs.statSync(inputPath);
  const sizeInMB = stat.size / (1024 * 1024);
  console.log(`Processing ${path.basename(inputPath)} (${sizeInMB.toFixed(2)} MB)...`);
  
  const outputPath = inputPath.replace('.mp4', '_compressed.mp4');
  
  try {
    // Compression parameters:
    // -vf "scale='min(1280,iw)':-2" - scales the video to max 1280px width (720p) maintaining aspect ratio
    // -vcodec libx264 - H.264 encoding
    // -crf 26 - Constant Rate Factor (23 is default, 26 is great compression with minimal quality loss)
    // -preset fast - encoding speed preset
    // -acodec aac - AAC audio codec
    // -b:a 128k - audio bitrate
    const cmd = `"${ffmpegPath}" -y -i "${inputPath}" -vf "scale='min(1280,iw)':-2" -vcodec libx264 -crf 26 -preset fast -acodec aac -b:a 128k "${outputPath}"`;
    
    console.log(`Running: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
    
    // Check sizes
    const oldSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    
    if (newSize < oldSize) {
      // Overwrite the original video
      fs.unlinkSync(inputPath);
      fs.renameSync(outputPath, inputPath);
      console.log(`Successfully compressed ${path.basename(inputPath)} from ${(oldSize / (1024 * 1024)).toFixed(2)} MB to ${(newSize / (1024 * 1024)).toFixed(2)} MB!`);
    } else {
      // Keep original
      fs.unlinkSync(outputPath);
      console.log(`Compression did not reduce size for ${path.basename(inputPath)}. Kept original.`);
    }
  } catch (err) {
    console.error(`Error compressing ${inputPath}:`, err);
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
}

console.log("Starting video compression...");
for (const video of videos) {
  compressVideo(video);
}
console.log("Video compression complete!");
