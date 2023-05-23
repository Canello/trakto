import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class CustomExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      // @ts-ignore
      message = exception.getResponse().message || 'Something went wrong';
    }

    let errors = [];

    if (typeof message === 'string') {
      errors.push({ code: `${statusCode}`, message });
    } else {
      errors = (message as []).map((m) => {
        return { code: statusCode, message: m };
      });
    }

    res.status(statusCode).json({ errors });
  }
}
