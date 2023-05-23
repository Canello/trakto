const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImagesRepository {
  private MAX_SIZE: number;

  constructor() {
    this.MAX_SIZE = 720;
  }

  // Download image from url into file system
  public async downloadImage(url: string) {
    const filename = uuidv4() + '.jpeg';
    const path = this.getPath(filename);

    await this.catchInvalidImage(async () => {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(path, Buffer.from(response.data), 'binary');
    });

    return filename;
  }

  // Get metadata from image file
  public async getMetadata(filename: string) {
    const path = this.getPath(filename);

    let metadata: any;
    await this.catchInvalidImage(async () => {
      metadata = await sharp(path).metadata();
    });

    return metadata;
  }

  // Generate compressed and resized image and save it in the file system
  public async generateThumbnail({ filename, compress, width, height }) {
    const biggerSide = Math.max(width, height);
    const path = this.getPath(filename);
    const thumbnailFilename = this.getThumbnailFilename(filename);
    const thumbnailPath = this.getPath(thumbnailFilename);

    if (biggerSide > this.MAX_SIZE) {
      await this.compressAndSaveResizedImage({
        originalPath: path,
        newPath: thumbnailPath,
        currentWidth: width,
        currentHeight: height,
        compress,
      });
    } else {
      await this.compressAndSaveOriginalImageCopy({
        newPath: thumbnailPath,
        compress,
      });
    }

    return thumbnailFilename;
  }

  // Handle errors due to invalid images
  private async catchInvalidImage(func: () => any) {
    try {
      await func();
    } catch (err) {
      throw new BadRequestException('Imagem inválida.');
    }
  }

  // Compress and save resized image
  private async compressAndSaveResizedImage({
    originalPath,
    newPath,
    currentWidth,
    currentHeight,
    compress,
  }) {
    const quality = this.compressToQuality(compress);
    const [newWidth, newHeight] = this.calculateResizedDimensions(
      currentWidth,
      currentHeight,
    );

    await this.catchInvalidImage(async () => {
      await sharp(originalPath)
        .resize(newWidth, newHeight)
        .jpeg({ quality })
        .toFile(newPath);
    });
  }

  // Compress and save copy of original image
  private async compressAndSaveOriginalImageCopy({ newPath, compress }) {
    const quality = this.compressToQuality(compress);

    await this.catchInvalidImage(async () => {
      await sharp(path).jpeg({ quality }).toFile(newPath);
    });
  }

  // Transforms compression rate into quality rate
  private compressToQuality(compress: number) {
    return Math.floor((1 - compress) * 100);
  }

  // Create thumbnail filename
  private getThumbnailFilename(filename: string) {
    const [filenameWithouExtension, extension] = filename.split('.');
    return filenameWithouExtension + '_thumb.' + extension;
  }

  // Create path to filename in the uploads folder
  private getPath(filename: string) {
    return path.join(__dirname, '..', 'public', 'images', filename);
  }

  // Calculate new dimensions, resizing bigger dimension to 720px and maintaining aspect ratio constant
  private calculateResizedDimensions(width: number, height: number) {
    let newWidth: number, newHeight: number;
    const aspectRatio = width / height;

    if (width >= height) {
      newWidth = this.MAX_SIZE;
      newHeight = (1 / aspectRatio) * newWidth;
    } else {
      newHeight = this.MAX_SIZE;
      newWidth = aspectRatio * newHeight;
    }

    return [newWidth, newHeight];
  }
}
