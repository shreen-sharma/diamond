import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class AnalyticsReportService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
    this.authenticationService = authService;
  }

  getSalesVolumeReport(startDate: any, endDate: any): Observable<any> {
    return this.http.get('/getSalesVolumeReport/' + startDate + '/' + endDate).map(req => req.json())
  }

  getStockAgeingReport(): Observable<any> {
    return this.http.get('/getStockAgeingReport').map(req => req.json())
  }
  getAllPartyEntityByType(partyType: string): Observable<any> {
    var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getAllPartyEntityByType/' + partyType, options).map(req => req.json());
  }
  getItemAnalyzerForSales(lotId: any, itemId: any,startDate: any, endDate: any, partyId: any): Observable<any> {
    return this.http.get('/getItemAnalyzerForSales/' + lotId + '/' + itemId + '/' + startDate + '/' + endDate + '/' + partyId).map(req => req.json())
  }
  getItemAnalyzerForPurchase(lotId: any, itemId: any, fromDate: any, toDate: any, supplierId: any): Observable<any> {
    return this.http.get('/getItemAnalyzerForPurchase/' + lotId + '/' + itemId + '/' + fromDate + '/' + toDate + '/' + supplierId).map(req => req.json())
  }

 
  getSupplierAnalyzeByItemWise(lotId: any, itemId: any): Observable<any> {
    return this.http.get('/getSupplierAnalyzeByItemWise/' + lotId + '/' + itemId).map(req => req.json())
  }
  getCustomerAnalyzeByItemWise(lotId: any, itemId: any): Observable<any> {
    return this.http.get('/getCustomerAnalyzeByItemWise/' + lotId + '/' + itemId).map(req => req.json())
  }


}

