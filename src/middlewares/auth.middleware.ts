import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;
    if (!authToken) {
      throw new UnauthorizedException('invalid token');
    }
    const [, token] = authToken.split(' ');
    try {
      const { sub } = verify(token, process.env.SECRET_JWT);
      req['userId'] = sub;
      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new UnauthorizedException('invalid token');
      }
    }
  }
}
