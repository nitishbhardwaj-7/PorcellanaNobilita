import fs from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { Jimp } from "jimp";
import ffmpegPath from "ffmpeg-static";

const execFileAsync = promisify(execFile);

// Matches the resize/quality settings already used by the project's one-off
// compress-images.js / compress-videos.js scripts, now applied automatically
// to every CMS upload instead of needing a manual script run. Full-resolution
// originals (often several MB) were the single biggest cause of slow image/
// video loading on the live site — most of that size is far more resolution
// than the page ever displays.
const IMAGE_MAX_DIMENSION = 1920;
const IMAGE_JPEG_QUALITY = 75;
const VIDEO_MAX_WIDTH = 1280;

const COMPRESSIBLE_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const COMPRESSIBLE_VIDEO_EXTENSIONS = new Set([".mp4"]);

/**
 * Saves a file to the local filesystem in the public/uploads directory.
 * Images and videos are automatically resized/re-encoded to reasonable
 * web-delivery sizes first (see constants above) — never throws on a
 * compression failure, since a slightly larger file is far better than a
 * failed upload; it just falls back to saving the original untouched.
 * @param file The file object from Request.formData()
 * @param folder Subfolder to group files (e.g. "services", "pages")
 * @returns Relative public path to the uploaded file
 */
export async function saveFile(file: File, folder: string = ""): Promise<{ url: string; fileName: string; fileSize: number; fileType: string }> {
  const bytes = await file.arrayBuffer();
  const originalBuffer = Buffer.from(bytes);

  // Target directory
  const relativeUploadDir = path.join("uploads", folder);
  const absoluteUploadDir = path.join(process.cwd(), "public", relativeUploadDir);

  // Ensure the directory exists
  await fs.mkdir(absoluteUploadDir, { recursive: true });

  // Clean filename and make unique
  const originalExtension = path.extname(file.name).toLowerCase();
  const cleanBaseName = path
    .basename(file.name, originalExtension)
    .replace(/[^a-zA-Z0-9-_]/g, "_");
  const uniqueFileName = `${cleanBaseName}_${Date.now()}${originalExtension}`;
  const absoluteFilePath = path.join(absoluteUploadDir, uniqueFileName);

  if (COMPRESSIBLE_IMAGE_EXTENSIONS.has(originalExtension)) {
    await writeCompressedImage(originalBuffer, originalExtension, absoluteFilePath);
  } else if (COMPRESSIBLE_VIDEO_EXTENSIONS.has(originalExtension)) {
    await writeCompressedVideo(originalBuffer, absoluteFilePath);
  } else {
    await fs.writeFile(absoluteFilePath, originalBuffer);
  }

  // Real on-disk size after compression (falls back to the original size if
  // the stat somehow fails, which shouldn't happen since we just wrote it).
  const finalSize = await fs.stat(absoluteFilePath).then((s) => s.size).catch(() => file.size);

  // Public URL path
  const fileUrl = `/uploads/${folder ? folder + "/" : ""}${uniqueFileName}`;

  return {
    url: fileUrl,
    fileName: file.name,
    fileSize: finalSize,
    fileType: file.type || getFileTypeFromExtension(originalExtension),
  };
}

/**
 * Resizes (if larger than IMAGE_MAX_DIMENSION on either side) and
 * re-compresses an image, writing the result to `outputPath`. Falls back to
 * writing the original buffer untouched if Jimp can't process it for any
 * reason (e.g. a corrupt or unusual file) — a working, uncompressed upload
 * beats a failed one.
 */
async function writeCompressedImage(buffer: Buffer, ext: string, outputPath: string): Promise<void> {
  try {
    const image = await Jimp.fromBuffer(buffer);
    const { width, height } = image.bitmap;

    if (width > IMAGE_MAX_DIMENSION || height > IMAGE_MAX_DIMENSION) {
      if (width > height) {
        image.resize({ w: IMAGE_MAX_DIMENSION });
      } else {
        image.resize({ h: IMAGE_MAX_DIMENSION });
      }
    }

    const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    const options = mime === "image/png" ? {} : { quality: IMAGE_JPEG_QUALITY };
    const outBuffer = await image.getBuffer(mime as any, options as any);
    await fs.writeFile(outputPath, outBuffer);
  } catch (err) {
    console.error("[upload] Image compression failed, saving original:", err);
    await fs.writeFile(outputPath, buffer);
  }
}

/**
 * Transcodes a video to a reasonable web-delivery bitrate/resolution via
 * ffmpeg, writing the result to `outputPath`. Runs ffmpeg as a child process
 * (not the main Node thread) so it doesn't block the site for other visitors
 * while a large video is being processed. Falls back to writing the original
 * buffer untouched if ffmpeg fails for any reason.
 */
async function writeCompressedVideo(buffer: Buffer, outputPath: string): Promise<void> {
  const tempInputPath = `${outputPath}.original.tmp`;
  try {
    await fs.writeFile(tempInputPath, buffer);
    await execFileAsync(ffmpegPath as string, [
      "-y",
      "-i", tempInputPath,
      "-vf", `scale='min(${VIDEO_MAX_WIDTH},iw)':-2`,
      "-vcodec", "libx264",
      "-crf", "26",
      "-preset", "fast",
      "-acodec", "aac",
      "-b:a", "128k",
      outputPath,
    ]);
  } catch (err) {
    console.error("[upload] Video compression failed, saving original:", err);
    await fs.writeFile(outputPath, buffer);
  } finally {
    await fs.unlink(tempInputPath).catch(() => {});
  }
}

/**
 * Deletes a file from the local filesystem.
 * @param fileUrl The relative public URL path of the file
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl.startsWith("/uploads/")) {
      return false;
    }
    const absoluteFilePath = path.join(process.cwd(), "public", fileUrl);
    await fs.unlink(absoluteFilePath);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

function getFileTypeFromExtension(ext: string): string {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}
