// import { CredentialDetails } from 'crypto';
// import { Credentials } from './index';
import { Observable } from 'rxjs/Observable';

import { Credentials, LoginContext } from './authentication.service';

export class MockAuthenticationService {
  credentials: Credentials;
  // credentials: Credentials = {
  //   username: context.username,
  //   access_token: '123456',
  //   company='1',
  //   interval_token: '12',
  //   expires: 1245
  // };

  // login(context: LoginContext): Observable<Credentials> {
  //   return Observable.of({
  //     username: context.username,
  //     access_token: '123456'    });
  // }

  logout(): Observable<boolean> {
    this.credentials = null;
    return Observable.of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

}
