import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import debug from 'debug';

const log = debug('bank:HTTP');

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        event => undefined,
        // Operation failed; error is an HttpErrorResponse
        (error: HttpErrorResponse) => {
          // if (error.status === 401 || error.status === 403) {
          //     this.router.navigate(['/session-lost']);
          // }
          log('error', error);
        }
      )
    );
  }
}
