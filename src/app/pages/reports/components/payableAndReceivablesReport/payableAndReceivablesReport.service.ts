import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class PayableAndReceivablesReportService {

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


  getImportInvoiceBySupplierIdAndPaymentStatusAndBetweenDates(supplierId: number, status: string, startDate: any, endDate: any): Observable<any> {
    return this.http.get('/getImportInvoiceBySupplierIdAndPaymentStatusAndBetweenDates/' + supplierId + '/' + '/' + status + '/' + startDate + '/' + endDate).map(req => req.json())
  }


  getLocalPurchaseInvoicesBySupplierIdAndPaymentStatusAndBetweenDates(supplierId: number, status: string, startDate: any, endDate: any): Observable<any> {
    return this.http.get('/getLocalPurchaseInvoicesBySupplierIdAndPaymentStatusAndBetweenDates/' + supplierId + '/' + '/' + status + '/' + startDate + '/' + endDate).map(req => req.json())
  }

  getLocalSalesInvoiceByCustomerIdAndPaymentStatusAndBetweenDates(supplierId: number, status: string, startDate: any, endDate: any): Observable<any> {
    return this.http.get('/getLocalSalesInvoiceByCustomerIdAndPaymentStatusAndBetweenDates/' + supplierId + '/' + '/' + status + '/' + startDate + '/' + endDate).map(req => req.json())
  }

  getExportInvoiceByCustomerIdAndPaymentStatusAndBetweenDates(supplierId: number, status: string, startDate: any, endDate: any): Observable<any> {
    return this.http.get('/getExportInvoiceByCustomerIdAndPaymentStatusAndBetweenDates/' + supplierId + '/' + '/' + status + '/' + startDate + '/' + endDate).map(req => req.json())
  }

  getLocalSalesReceivableReport(supplierId: number, startDate: any, endDate: any, currId: any, status: any): Observable<any> {
    return this.http.get('/getLocalSalesReceivableReport/' + supplierId + '/' + startDate + '/' + endDate + '/' + currId + '/' + status).map(req => req.json())
  }
  getExportSalesReceivableReport(supplierId: number, startDate: any, endDate: any, currId: any, status: any): Observable<any> {
    return this.http.get('/getExportSalesReceivableReport/' + supplierId + '/' + startDate + '/' + endDate + '/' + currId + '/' + status).map(req => req.json())
  }

  getLocalPurchasePayableReport(supplierId: number, startDate: any, endDate: any, currId: any, status: any): Observable<any> {
    return this.http.get('/getLocalPurchasePayableReport/' + supplierId + '/' + startDate + '/' + endDate + '/' + currId + '/' + status).map(req => req.json())
  }
  getImportPurchasePayableReport(supplierId: number, startDate: any, endDate: any, currId: any, status: any): Observable<any> {
    return this.http.get('/getImportPurchasePayableReport/' + supplierId + '/' + startDate + '/' + endDate + '/' + currId + '/' + status).map(req => req.json())
  }
}

