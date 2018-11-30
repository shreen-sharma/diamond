import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class BalanceSheetService {

constructor(private http: HttpService) { }

getBalanceSheetDetails(): Observable<any> {
    return this.http.get('/getBalanceSheetDetails').map(req => req.json())
  }

 
}

