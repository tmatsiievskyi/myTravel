import { HttpException } from './HttpException';

export class UserNotAuthorized extends HttpException {
  constructor(id: string, action: string, resource: string) {
    super(
      403,
      `User with id ${id} not allowed to ${action} resource ${resource}`
    );
  }
}
