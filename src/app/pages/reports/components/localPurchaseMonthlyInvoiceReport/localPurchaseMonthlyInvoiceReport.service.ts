import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class LocalPurchaseMonthlyInvoiceReportService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
    this.authenticationService = authService;
  }

  getLocalPurchaseInvoiceReport(partyId: number, month: number, year: number): Observable<any> {
    return this.http.get('/getLocalPurchaseInvoiceReport/' + partyId + '/' + month + '/' + year).map(req => req.json())
  }

  getAllSupplierByType(type: string): Observable<any> {
    return this.http.get('/getAllPartiesByType/' + type).map(req => req.json())
  }

  getLocalPurchaseInvoiceReportBetweenDates(startDate: any, endDate: any): Observable<any> {
    return this.http.get('/getLocalPurchaseInvoiceReportBetweenDates/' + startDate + '/' + endDate).map(req => req.json())
  }

  getLocalPurchaseInvoiceReportBySupplierIdAndBetweenDates(supplierId: number, startDate: any, endDate: any): Observable<any> {
    return this.http.get('/getLocalPurchaseInvoiceReportBySupplierIdAndBetweenDates/' + supplierId + '/' + startDate + '/' + endDate).map(req => req.json())
  }

}

