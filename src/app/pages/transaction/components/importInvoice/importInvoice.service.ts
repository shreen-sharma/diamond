import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Injectable} from '@angular/core';

@Injectable()
export class ImportInvoiceService {

  constructor(private http: HttpService) { }

  getImportInvoiceData(): Observable<any> {
    return this.http.get('/getAllImportPurchaseOrderInvoice').map(req => req.json());
  }

  createImportInvoice(invoiceData: any): Observable<any> {
    return this.http.post('/addImportPurchaseOrderInvoice', invoiceData).map(req => req.json());
  }

  addOpeningStockImportPurchaseOrderInvoice(invoiceData: any): Observable<any> {
    return this.http.post('/addOpeningStockImportPurchaseOrderInvoice', invoiceData).map(req => req.json());
  }

  updateImportInvoice(invoiceData: any): Observable<any> {
    return this.http.post('/updateImportPurchaseOrderInvoice', invoiceData).map(req => req.json());
  }

  deleteImportInvoiceById(impId: string): Observable<any> {
    return this.http.delete('/deleteImportPurchaseOrderInvoiceById/' + impId).map(req => req.json());
  }

  getImportInvoiceDataById(importInvoiceId: any): Observable<any> {
    return this.http.get('/getImportPurchaseOrderInvoiceById/' + importInvoiceId).map(req => req.json());
  }

  getAllCommonMasterByType(itemType: string): Observable<any> {
    return this.http.get('/getAllCommonMasterByType/' + itemType).map(req => req.json())
  }

  // change url to import order
  getImportPurchaseOrderByTypeAndStatus(type: any, status: any): Observable<any> {
  return this.http.get('/getImportPurchaseOrderByTypeAndStatus/' + type + '/' + status).map(req => req.json());
  }
   getImportPurchaseOrderById(id: any): Observable<any> {
    return this.http.get('/getImportPurchaseOrderById/' + id).map(req => req.json());
  }
  getAddressById(id:any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getAddressById/' +id, options).map(req => req.json());
  }


  getAllOpeningStockImportPurchaseOrderInvoice(): Observable<any> {
    return this.http.get('/getAllOpeningStockImportPurchaseOrderInvoice').map(req => req.json());
  }
  getOpeningStockImportPurchaseOrderInvoiceByInvoiceId(id: any): Observable<any> {
    return this.http.get('/getOpeningStockImportPurchaseOrderInvoiceByInvoiceId/' + id).map(req => req.json());
  }
}
