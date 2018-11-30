import { HierarchyCreationService } from '../pages/company/components/hierarchyCreation/index';
import { ParaListService } from '../pages/masters/components/parameterList/index';
import { LotItemCreationService } from '../pages/stockManagement/components/lotItemCreation/index';
import { CurrencyService } from '../pages/masters/components/currency/index';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule, Http, XHRBackend, ConnectionBackend, RequestOptions } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AuthenticationGuard } from './authentication/authentication.guard';
import { AuthenticationService } from './authentication/authentication.service';
import { HttpCacheService } from './http/http-cache.service';
import { HttpService } from './http/http.service';

export function createHttpService(backend: ConnectionBackend,
                                  defaultOptions: RequestOptions,
                                  httpCacheService: HttpCacheService,
                                  authService: AuthenticationService) {
  return new HttpService(backend, defaultOptions, httpCacheService, authService);
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    TranslateModule,
    RouterModule,
    NgbModule.forRoot()
  ],
  exports: [],
  declarations: [],
  providers: [
    AuthenticationService,
    AuthenticationGuard,
    HttpCacheService,
    HttpCacheService,
    CurrencyService,
    LotItemCreationService,
    HierarchyCreationService,
    ParaListService,
    {
      provide: HttpService,
      deps: [XHRBackend, RequestOptions, HttpCacheService, AuthenticationService],
      useFactory: createHttpService
    }
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }

}
