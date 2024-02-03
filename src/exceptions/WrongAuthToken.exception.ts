import { HttpException } from './HttpException';

export class WrongAuthTokenException extends HttpException {
  constructor() {
    super(401, 'Token invalid or expired');
  }
}
