import {Injectable} from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ImportPurchaseOrderService {

  perchOrderData: any;  
  constructor(private http: HttpService) { }

  getImportPurchaseOrderData(): Observable<any> {
    return this.http.get('/getAllImportPurchaseOrder').map(req => req.json())
  }

  createImportPurchaseOrder(partyData: any): Observable<any> {
   return this.http.post('/addImportPurchaseOrder', partyData).map(req => req.json());
  }

  updateImportPurchaseOrder(partyData: any): Observable<any> {
     return this.http.put('/updateImportPurchaseOrder', partyData).map(req => req.json());
  }

  getImportPurchaseOrderById(poId: any): Observable<any> {
   return this.http.get('/getImportPurchaseOrderById/' + poId).map(req => req.json());
  }

  getAllPurchaseOrderDetailById(poId: any): Observable<any> {
    return this.http.get('/getAllImportPurchaseOrderDetailById/' + poId).map(req => req.json());
   }

  getImportPurchaseOrderByTypeAndStatus(type: any, status: any): Observable<any> {
    return this.http.get('/getImportPurchaseOrderByTypeAndStatus/' + type + '/' + status).map(req => req.json());
   }

  deleteImportPurchaseOrder(poId: number): Observable<any> {
    return this.http.delete('/deleteImportPurchaseOrder/' + poId); //.map(req => req.json());
  }

  getAllItemsByLotId(lotId: any): Observable<any[]> {
    return this.http.get('/lot/getAllItemsByLotId/' + lotId).map(req => req.json());
  }

  getOpeningStockStatus(): Observable<any> {
    return this.http.get('/isOpenStockEntryComplete').map(req => req.json());
  }
   getAllLotItems(): Observable<any[]> {
    return this.http.get('/lot/getAllLotItem').map(req => req.json());
  }
  
}
