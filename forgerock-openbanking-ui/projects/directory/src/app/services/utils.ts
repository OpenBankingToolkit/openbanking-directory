import { HttpHeaders } from '@angular/common/http';

export function getHTTPOptions(options?: any) {
  return {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    ...options
  };
}
