import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class ConsignmentOrDcSummaryReportService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
    this.authenticationService = authService;
  }

 

  getConsignmentOrDcSummayByConsignmentStatus(status: string): Observable<any> {
    return this.http.get('/MIS/getConsignmentOrDcSummayByConsignmentStatus/'+status).map(req => req.json())
  }


}

