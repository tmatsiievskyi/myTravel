import { IApiResp } from '../interfaces';

export class Formatter {
  public formatResp = (
    result: any,
    time: number,
    message?: string,
    total?: number
  ) => {
    let numRecords = 0;
    let errors: Error[] | null = null;
    let data = null;

    if (result && result instanceof Array) {
      numRecords = result.length;
      data = result;
    } else if (result && result instanceof Error) {
      errors = [result];
    } else if (result || result === 0) {
      numRecords = 1;
    }

    const resp: IApiResp = {
      data,
      errors,
      message: message ? message : null,
      meta: {
        length: numRecords,
        took: time,
        total: total ? total : numRecords,
      },
    };

    return resp;
  };
}
