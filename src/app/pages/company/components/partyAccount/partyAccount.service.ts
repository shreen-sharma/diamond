import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class PartyAccountService {

  authenticationService: AuthenticationService;

    constructor(private http: HttpService, private authService: AuthenticationService) {
     this.authenticationService = authService;
    }

  getAllPartyAccount(): Observable<any> {
    return this.http.get('/getAllPartyAccounts').map(req => req.json());
  }

  getAllPartyAccountDetails(): Observable<any> {
    return this.http.get('/getAllPartyAccountDetails').map(req => req.json());
  }

  createPartyAccount(partAccData: any): Observable<any> {
    return this.http.post('/addPartyAccountDetail', partAccData).map(req => req.json());
  }

  updatePartyAccount(partAccData: any): Observable<any> {
    return this.http.put('/updatePartyAccountDetail', partAccData).map(req => req.json());
  }

  deletePartyAccount(partyAccId: any): Observable<any> {
    return this.http.delete('/deletePartyAccountDetailByID/' + partyAccId);
  }

  getPartyAccountById(partyAccId: any): Observable<any> {
    return this.http.get('/getPartyAccountDetailById/' + partyAccId).map(req => req.json());
  }
  getPartyAccountDetailByProcess(processType: any): Observable<any> {
    return this.http.get('/getAllPartyAccountDetailByProcessType/' + processType).map(req => req.json());
  }
}

