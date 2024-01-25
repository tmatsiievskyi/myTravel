import { User } from '../services/user';

import { ISerchResult } from './searchResult.interface';

//TODO: remove ?
export interface IDao {
  getAll?(
    user: User,
    params?: { [key: string]: any }
  ): Promise<ISerchResult | Error>;
  getOne?(user: User, id: string): Promise<object | Error>;
  create?(user: User, data: any): Promise<object | Error>;
  remove?(user: User, id: string): Promise<object | Error>;
}
