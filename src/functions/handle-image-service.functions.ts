const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const MAX_SIZE = 720;

// Download image from url into file system
export async function downloadImage(url: string) {
  const filename = uuidv4() + '.jpeg';
  const path = getPath(filename);

  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(path, Buffer.from(response.data), 'binary');

  return filename;
}

// Get metadata from image file
export async function getMetadata(filename: string) {
  const path = getPath(filename);
  const metadata = await sharp(path).metadata();
  return metadata;
}

// Generate compressed and resized image, and saves it in the file system
export async function generateThumbnail({ filename, compress, width, height }) {
  const biggerSide = Math.max(width, height);
  const path = getPath(filename);
  const quality = Math.floor((1 - compress) * 100);
  const thumbnailFilename = getThumbnailFilename(filename);
  const thumbnailPath = getPath(thumbnailFilename);

  if (biggerSide > MAX_SIZE) {
    // Compress and save resized image
    const [newWidth, newHeight] = calculateResizedDimensions(width, height);
    await sharp(path)
      .resize(newWidth, newHeight)
      .jpeg({ quality })
      .toFile(thumbnailPath);
  } else {
    // Compress and save copy of original image
    await sharp(path).jpeg({ quality }).toFile(thumbnailPath);
  }

  return thumbnailFilename;
}

// Make thumbnail filename and create path to it in the uploads folder
function getThumbnailFilename(filename: string) {
  const [filenameWithouExtension, extension] = filename.split('.');
  return filenameWithouExtension + '_thumb.' + extension;
}

// Create path to filename in the uploads folder
function getPath(filename: string) {
  return path.join(__dirname, '..', '..', 'public', 'images', filename);
}

// Calculate new dimensions, resizing bigger dimension to 720px and maintaining aspect ratio constant
function calculateResizedDimensions(width: number, height: number) {
  let newWidth: number, newHeight: number;
  const aspectRatio = width / height;

  if (width >= height) {
    newWidth = MAX_SIZE;
    newHeight = (1 / aspectRatio) * newWidth;
  } else {
    newHeight = MAX_SIZE;
    newWidth = aspectRatio * newHeight;
  }

  return [newWidth, newHeight];
}

// Create image stream to send back to client
export function createImageStream(filename: string) {
  const path = getPath(filename);
  return fs.createReadStream(path);
}
