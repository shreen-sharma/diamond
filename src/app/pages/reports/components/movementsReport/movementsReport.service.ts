import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class MovementsReportService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
    this.authenticationService = authService;
  }
  getCompletedPurchasesNP(partyId: any,fromDate: any,toDate: any,transType : any): Observable<any> {
    return this.http.get('/getCompletedPurchasesNP/'+ partyId + '/' + fromDate + '/' + toDate+'/'+transType).map(req => req.json())
  }
 
  getAllSupplierByType(type: string): Observable<any> {
    return this.http.get('/getAllPartiesByType/' + type).map(req => req.json())
  }
  
  getTopSoldItems(): Observable<any> {
    return this.http.get('/getTopSoldItems').map(req => req.json())
  }

  getTopSoldRevenueItems(): Observable<any> {
    return this.http.get('/getTopSoldRevenueItems').map(req => req.json())
  }

  getTopSoldProfitItems(): Observable<any> {
    return this.http.get('/getTopSoldProfitItems').map(req => req.json())
  }

}

