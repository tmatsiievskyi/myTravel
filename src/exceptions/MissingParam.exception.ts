import { HttpException } from './HttpException';

export class MissingParamException extends HttpException {
  constructor(message: string) {
    super(400, message);
  }
}
