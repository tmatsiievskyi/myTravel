import { HttpException } from './HttpException';

export class EmailDeliveryException extends HttpException {
  constructor(address: string) {
    super(400, `Error trying to send email to ${address}`);
  }
}
