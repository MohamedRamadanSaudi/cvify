import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class IpAddressExtractorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    (req as any).clientIp =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.socket.remoteAddress ||
      null;
    next();
  }
}
