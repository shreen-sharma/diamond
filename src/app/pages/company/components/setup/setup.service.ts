import { RequestOptions, Headers } from '@angular/http';
import { HttpService } from '../../../../core/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SetupService {

  currencyData: any[] = [];
  constructor(private http: HttpService) {

  }


  addGroupCompany(groupCompany: any): Observable<any> {
    return this.http.post('/addGroupAndCompany', groupCompany).map(req => req.json());
  }
}
