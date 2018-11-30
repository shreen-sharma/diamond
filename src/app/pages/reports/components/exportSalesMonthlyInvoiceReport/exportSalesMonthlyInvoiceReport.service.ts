import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class ExportSalesMonthlyInvoiceReportService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
    this.authenticationService = authService;
  }

  getAllExportSalesInvoiceReport(partyId: number, month: number, year: number): Observable<any> {
    return this.http.get('/getAllExportSalesInvoiceReport/' + partyId + '/' + month + '/' + year).map(req => req.json())
  }

  getAllSupplierByType(type: string): Observable<any> {
    return this.http.get('/getAllPartiesByType/' + type).map(req => req.json())
  }

  getExportSalesInvoiceReportBetweenDates(startDate: string, endDate: string): Observable<any> {
    return this.http.get('/getExportSalesInvoiceReportBetweenDates/' + startDate + '/' + endDate).map(req => req.json())
  }

  getExportSalesInvoiceReportBySupplierIdAndBetweenDates(customerId: number, startDate: string, endDate: string): Observable<any> {
    return this.http.get('/getExportSalesInvoiceReportBySupplierIdAndBetweenDates/' + customerId + '/' + startDate + '/' + endDate).map(req => req.json())
  }



}

