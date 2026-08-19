import fs from "fs/promises";
import path from "path";

/**
 * Saves a file to the local filesystem in the public/uploads directory.
 * @param file The file object from Request.formData()
 * @param folder Subfolder to group files (e.g. "services", "pages")
 * @returns Relative public path to the uploaded file
 */
export async function saveFile(file: File, folder: string = ""): Promise<{ url: string; fileName: string; fileSize: number; fileType: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

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

  // Write file
  await fs.writeFile(absoluteFilePath, buffer);

  // Public URL path
  const fileUrl = `/uploads/${folder ? folder + "/" : ""}${uniqueFileName}`;

  return {
    url: fileUrl,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || getFileTypeFromExtension(originalExtension),
  };
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
