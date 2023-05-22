import { Injectable } from '@nestjs/common';
import { HandleImageDto } from './dtos/handle-image.dto';
import {
  downloadImage,
  generateThumbnail,
  getMetadata,
} from './functions/handle-image-service.functions';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async handleImage({ image, compress }: HandleImageDto) {
    const filename = await downloadImage(image);
    const metadata = await getMetadata(filename);

    // Salvar metadata no MongoDB
    const thumbnailFilename = await generateThumbnail({
      filename,
      compress,
      width: metadata.width,
      height: metadata.height,
    });

    return {
      localpath: {
        original: process.env.API_ADDRESS + '/images/' + filename,
        thumb: process.env.API_ADDRESS + '/images/' + thumbnailFilename,
      },
      metadata,
    };
  }
}
