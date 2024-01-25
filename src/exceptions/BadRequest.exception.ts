import { getErrorMessage } from '../utils';

import { HttpException } from './HttpException';

export class BadRequestException extends HttpException {
  constructor(error: unknown) {
    const message = getErrorMessage(error);
    super(400, message);
  }
}
