import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class LocalSalesmonthlyInvoiceReportService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
    this.authenticationService = authService;
  }

  getLocalSalesInvoiceReport(partyId: number, month: number, year: number): Observable<any> {
    return this.http.get('/getLocalSalesInvoiceReport/' + partyId + '/' + month + '/' + year).map(req => req.json())
  }
  getLocalSalesInvoiceByCustomerIdAndBetweenDates(partyId: number, startDate: string, endDate: string): Observable<any>{
    return this.http.get('/getLocalSalesInvoiceByCustomerIdAndBetweenDates/' + partyId + '/' + startDate + '/' + endDate).map(req => req.json())
  }

  getAllSupplierByType(type: string): Observable<any> {
    return this.http.get('/getAllPartiesByType/' + type).map(req => req.json())
  }

  getLocalSalesInvoiceReportBetweenDates(startDate: string, endDate: string): Observable<any> {
    return this.http.get('/getLocalSalesInvoiceReportBetweenDates/' + startDate + '/' + endDate).map(req => req.json())
  }


  getExportSalesInvoiceReportBySupplierIdAndBetweenDates(supplierId: number, startDate: string, endDate: string): Observable<any> {
    return this.http.get('/getExportSalesInvoiceReportBySupplierIdAndBetweenDates/' + supplierId + '/' + startDate + '/' + endDate).map(req => req.json())
  }

}

