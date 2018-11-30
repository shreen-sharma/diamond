import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class ImportPurchaseMonthlyInvoiceReportService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
    this.authenticationService = authService;
  }

  getAllImportPurchaseOrderInvoiceReport(partyId: number, month: number, year: number): Observable<any> {
    return this.http.get('/getAllImportPurchaseOrderInvoiceReport/' + partyId + '/' + month + '/' + year).map(req => req.json())
  }

  getAllSupplierByType(type: string): Observable<any> {
    return this.http.get('/getAllPartiesByType/' + type).map(req => req.json())
  }

  getImportPurchaseInvoiceReportBetweenDates(startDate: string, toDate: string): Observable<any> {
    return this.http.get('/getImportPurchaseInvoiceReportBetweenDates/' + startDate + '/' + toDate).map(req => req.json())
  }

  getExportSalesInvoiceReportBySupplierIdAndBetweenDates(supplierId: number, startDate: string, endDate: string): Observable<any> {
    return this.http.get('/getImportPurchaseInvoiceReportBySupplierIdAndBetweenDates/' + supplierId + '/' + startDate + '/' + endDate).map(req => req.json())
  }
}

