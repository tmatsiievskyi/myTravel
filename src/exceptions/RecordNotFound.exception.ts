import { HttpException } from './HttpException';

export class RecordNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Record with id ${id} not found`);
  }
}
