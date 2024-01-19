import { HttpException } from './HttpException';

export class DuplicateRecordException extends HttpException {
  constructor() {
    super(400, 'Duplicate record already exists');
  }
}
