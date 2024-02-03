import { HttpException } from './HttpException';

export class AuthTokenExpiredException extends HttpException {
  constructor() {
    super(
      401,
      'Authentication token expired. Please check email for new token'
    );
  }
}
