import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { SessionInterceptor } from './session';

export const httpInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: SessionInterceptor, multi: true }];
