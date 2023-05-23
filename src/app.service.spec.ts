import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Repository } from 'typeorm';
import { Metadata } from './metadata.entity';
import { ImagesRepository } from './images.repository';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppController', () => {
  require('dotenv').config();
  let appService: AppService;
  let fakeMetadataRepository: any;

  beforeEach(async () => {
    fakeMetadataRepository = {
      create({ image, compress }: { image: string; compress: number }) {
        return { image, compress };
      },
      save(newMetadata: Partial<Metadata>) {
        return Promise.resolve(newMetadata);
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(Metadata),
          useValue: fakeMetadataRepository,
        },
        ImagesRepository,
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
    fakeMetadataRepository = app.get<Repository<Metadata>>(
      getRepositoryToken(Metadata),
    );
  });

  it('can create an instance of AppService', async () => {
    expect(appService).toBeDefined();
  });

  it('throws BadRequestException when "image" doesn\'t point to an image file', async () => {
    const image = 'werw.com';
    const compress = 0.9;

    await expect(appService.handleImage({ image, compress })).rejects.toThrow(
      BadRequestException,
    );
  });
});
