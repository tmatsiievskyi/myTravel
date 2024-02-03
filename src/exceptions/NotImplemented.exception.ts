import { HttpException } from './HttpException';

export class NotImplementedException extends HttpException {
  constructor(methodName: string) {
    super(404, `Method ${methodName} is not implemented`);
  }
}
