import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleImageDto } from './dtos/handle-image.dto';
import { Metadata } from './metadata.entity';
import { ImagesRepository } from './images.repository';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Metadata)
    private metadataRepository: Repository<Metadata>,
    private imagesRepository: ImagesRepository,
  ) {}

  // Download original image and save it on public/images
  async handleImage({ image, compress }: HandleImageDto) {
    const filename = await this.imagesRepository.downloadImage(image);

    // Save metadata on MongoDB
    const metadata = await this.imagesRepository.getMetadata(filename);
    const newMetadata = this.metadataRepository.create({ filename, metadata });
    const savedMetadata = await this.metadataRepository.save(newMetadata);

    // Create thumbnail and save it on public/images folder
    const thumbnailFilename = await this.imagesRepository.generateThumbnail({
      filename,
      compress,
      width: metadata.width,
      height: metadata.height,
    });

    // Send reponse
    return {
      localpath: {
        original: process.env.API_ADDRESS + '/images/' + filename,
        thumb: process.env.API_ADDRESS + '/images/' + thumbnailFilename,
      },
      metadata: savedMetadata.metadata,
    };
  }
}
