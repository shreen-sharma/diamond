import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Injectable} from '@angular/core';

@Injectable()
export class ImportRemittanceService {

  constructor(private http: HttpService) { }

  getImportRemittanceData(): Observable<any> {
    return this.http.get('/getAllImportPurchaseOrderInvoice').map(req => req.json());
  }

  createImportRemittance(invoiceData: any): Observable<any> {
    return this.http.post('/addImportPurchaseOrderRemittance', invoiceData).map(req => req.json());
  }

  updateImportRemittance(invoiceData: any): Observable<any> {
    return this.http.post('/addImportPurchaseOrderInvoice', invoiceData).map(req => req.json());
  }

  deleteImportRemittanceById(impId: string): Observable<any> {
    return this.http.delete('/updateImportPurchaseOrderInvoice/' + impId).map(req => req.json());
  }

  getImportRemittanceDataById(importRemittanceId: any): Observable<any> {
    return this.http.get('/getImportPurchaseOrderRemittanceById/' + importRemittanceId).map(req => req.json());
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
    return this.http.get('/getAddressById/' + id, options).map(req => req.json());
  }
}
