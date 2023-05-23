const path = require('path');
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Metadata } from './metadata.entity';
import { ImagesRepository } from './images.repository';
import { CustomExceptionFilter } from './filters/custom-exception.filter';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: `mongodb+srv://${process.env.MONGODB_ATLAS_USERNAME}:${process.env.MONGODB_ATLAS_PASSWORD}@cluster0.c2gigor.mongodb.net/?retryWrites=true&w=majority`,
      useNewUrlParser: true,
      synchronize: true,
      logging: true,
      entities: [Metadata],
    }),
    TypeOrmModule.forFeature([Metadata]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ImagesRepository,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
