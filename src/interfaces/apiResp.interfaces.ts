export interface IApiResp {
  data: any | null;
  meta: { [key: string]: any } | null;
  errors: Error[] | null;
  message: string | null;
}
