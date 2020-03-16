import { HttpHeaders, HttpParams } from '@angular/common/http';

export function getHTTPOptions(
  options?: any
): {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
} {
  return {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    ...options
  };
}
