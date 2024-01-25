import { HttpException } from './HttpException';

export class AllreadyExistsException extends HttpException {
  constructor(entity: string, value: string) {
    super(400, `${entity} with ${value} already exists`);
  }
}
