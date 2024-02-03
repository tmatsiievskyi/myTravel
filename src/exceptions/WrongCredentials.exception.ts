import { HttpException } from './HttpException';

export class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, 'Email or password does not match');
  }
}
