import { BadRequestException } from '@nestjs/common';
import { ImagesRepository } from './images.repository';

describe('AppRepository', () => {
  let imagesRepository: ImagesRepository;

  beforeEach(() => {
    imagesRepository = new ImagesRepository();
  });

  it('downloadImage should throw BadRequestException if an invalid image is provided', async () => {
    const url = 'qwrq.com';
    await expect(imagesRepository.downloadImage(url)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('getMetadata should throw and error if an invalid image is provided', async () => {
    const filename = 'wrong.jpeg';
    await expect(imagesRepository.getMetadata(filename)).rejects.toThrow(
      BadRequestException,
    );
  });
});
