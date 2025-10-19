import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(`HTTP`);

  use(req: Request, res: Response, next: NextFunction) {
    const startAt = process.hrtime();
    const { method, originalUrl } = req;

    const ip = req['clientIp'];

    res.on('finish', () => {
      const { statusCode } = res;
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${responseTime.toFixed(2)}ms ${ip}`,
      );
    });
    next();
  }
}
