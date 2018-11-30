import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ReceiptEntryService {

  constructor(private http: HttpService) { }

  isExport: boolean = false;

  getAllReceiptEntry(): Observable<any> {
    return this.http.get('/getAllReceiptMaster').map(req => req.json());
  }

  getReceiptEntryById(receiptId: any): Observable<any> {
    return this.http.get('/getReceiptMasterById/' + receiptId).map(req => req.json());
  }

  createReceiptEntry(data: any): Observable<any> {
    return this.http.post('/addReceiptMaster/', data).map(req => req.json());
  }

  getReceiptDetailsBySalesInvoiceId(invId: any, invoiceType: string): Observable<any> {
    return this.http.get('/getReceiptDetailsBySalesInvoiceId/' + invId + '/' + invoiceType).map(req => req.json());
  }

  getAllLocSalesInvoicesByCompletedAndPaymentStatus(cStatus: any, pStatus: any): Observable<any> {
    return this.http.get('/getLocalSalesMasterByCompletedAndPaymentStatus/' + cStatus + '/' + pStatus).map(req => req.json());
  }

  getSalesInvoiceDataById(id: any): Observable<any> {
    return this.http.get('/getLocalSalesDetailById/' + id).map(req => req.json());
  }

  getExportSalesInvoiceByCompletedAndPaymentStatus(cStatus: any, pStatus: any): Observable<any> {
    return this.http.get('/getExportSalesInvoiceByCompletedAndPaymentStatus/' + cStatus + '/' + pStatus).map(req => req.json());
  }

  getExportMasterById(id: any): Observable<any> {
    return this.http.get('/getExportMasterById/' + id).map(req => req.json());
  }

}
