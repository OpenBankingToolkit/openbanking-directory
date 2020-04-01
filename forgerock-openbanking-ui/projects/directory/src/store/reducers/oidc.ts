import { createAction } from '@ngrx/store';

import { OIDCLogoutTypes } from '@forgerock/openbanking-ngx-common/oidc';

export const logoutAction = createAction(OIDCLogoutTypes.LOGOUT_SUCCESS);
