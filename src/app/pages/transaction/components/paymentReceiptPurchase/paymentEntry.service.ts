import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Injectable} from '@angular/core';

@Injectable()
export class PaymentEntryService {

  isExport: boolean;

  constructor(private http: HttpService) { }

  getAllPaymentEntry(): Observable<any> {
    return this.http.get('/getAllPaymentEntry').map(req => req.json());
  }

  getPaymentEntryById(paymentId: any): Observable<any> {
    return this.http.get('/getPaymentEntryById/' + paymentId).map(req => req.json());
  }

  createPaymentEntry(data: any): Observable<any> {
    return this.http.post('/addPaymentEntry', data).map(req => req.json());
  }

  getPaymentDetailsByPurchaseInvoiceId(invId: any,invoiveType: string): Observable<any> {
    return this.http.get('/getPaymentDetailsByPurchaseInvoiceId/' + invId+'/'+invoiveType).map(req => req.json());
  }

  getAllLocPurchaseInvoicesByCompletedAndPaymentStatus(cStatus: any, pStatus: any): Observable<any> {
    return this.http.get('/getLocalPurchaseMasterByCompletedAndPaymentStatus/' + cStatus + '/' + pStatus).map(req => req.json());
  }

  getPurchaseInvoiceDataById(id: any): Observable<any> {
    return this.http.get('/getLocalPurchaseMasterById/' + id).map(req => req.json());
  }

  getImportPurchaseInvoiceByCompletedAndPaymentStatus(cStatus: any, pStatus: any): Observable<any> {
    return this.http.get('/getImportPurchaseInvoiceByCompletedAndPaymentStatus/' + cStatus + '/' + pStatus).map(req => req.json());
  }

  getImportPurchaseOrderInvoiceById(id: any): Observable<any> {
    return this.http.get('/getImportPurchaseOrderInvoiceById/' + id).map(req => req.json());
  }

}
