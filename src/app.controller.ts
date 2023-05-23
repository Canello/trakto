import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { HandleImageDto } from './dtos/handle-image.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/image/save')
  handleImage(@Body() body: HandleImageDto) {
    return this.appService.handleImage(body);
  }
}
