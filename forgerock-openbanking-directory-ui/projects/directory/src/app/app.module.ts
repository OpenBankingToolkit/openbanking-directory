import { NgModule, InjectionToken, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FuseSharedModule } from 'directory/src/app/theme-shared.module';
import { MatSharedModule } from 'directory/src/app/mat-shared.module';
import { AppComponent } from 'directory/src/app/app.component';
import rootReducer from 'directory/src/store';
import { RootEffects } from 'directory/src/store/effects';
import { environment } from 'directory/src/environments/environment';
// Layouts
import { ForgerockSimpleLayoutModule } from 'ob-ui-libs/layouts/simple';
import { FuseVerticalLayoutModule } from './layouts/fuse/vertical/vertical.module';
import { ForgerockConfigService } from 'ob-ui-libs/services/forgerock-config';
import { IState } from '../models';
import { ForgerockSharedModule } from 'ob-ui-libs/shared';
import { AppRoutingModule } from './app-routing.module';
import { CookieModule } from 'ngx-cookie';
import { httpInterceptorProviders } from './interceptors';
import { ForgerockOIDCModule } from 'ob-ui-libs/oidc';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<IState>>('Registered Reducers');

export function getReducers() {
  return rootReducer;
}

export function init_app(appConfig: ForgerockConfigService) {
  return () => appConfig.fetchAndMerge(environment);
}

export function createForgerockOIDCConfigFactory(config: ForgerockConfigService) {
  return {
    backendURL: config.get('directoryBackend')
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CookieModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ForgerockSimpleLayoutModule,
    FuseVerticalLayoutModule,
    ForgerockOIDCModule.forRoot(createForgerockOIDCConfigFactory),
    ForgerockSharedModule,
    // Material Design
    MatSharedModule,
    // Store
    StoreModule.forRoot(REDUCER_TOKEN),
    EffectsModule.forRoot(RootEffects),
    environment.devModules || [],
    // Theme
    FuseSharedModule
  ],
  providers: [
    {
      provide: REDUCER_TOKEN,
      deps: [],
      useFactory: getReducers
    },
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [ForgerockConfigService],
      multi: true
    },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
