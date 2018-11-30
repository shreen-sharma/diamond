import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Injectable} from '@angular/core';

@Injectable()
export class PurchaseInvoiceService {

  orderNo: Number;
  orderDate: String;
  partyName: String;

  constructor(private http: HttpService) { }

  
  getAllPurchaseOrdersByTypeAndStatus(type: string, status: string): Observable<any> {
    return this.http.get('/getAllLocalPurchaseOrdersByStatus/' + type + '/' + status).map(req => req.json());
  }

  getPurchaseInvoiceData(): Observable<any> {
    return this.http.get('/getAllLocalPurchaseMasters').map(req => req.json());
  }

  getPurchaseOrderDataById(id:any): Observable<any> {
    return this.http.get('/getLocalPurchaseOrderDetailById/' + id).map(req => req.json());
  }
  
  getPurchaseInvoiceDataById(id:any): Observable<any> {
    return this.http.get('/getLocalPurchaseMasterById/' + id).map(req => req.json());
  }
  deletePurchaseOrderInvoiceById(pInvoiceId: any): Observable<any> {
    return this.http.delete('/deleteLocalPurchaseMasterByID', pInvoiceId)//.map(req => req.json());
  }
  getAllCurrencies(): Observable<any> {
    return this.http.get('/getAllCurrencies').map(req => req.json())}

  getAllCommonMasterByType(itemType: string): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getAllCommonMasterByType/' + itemType, options).map(req => req.json())
  }

  createPurchaseOrderInvoice(pInvoiceData: any): Observable<any> {
    return this.http.post('/addLocalPurchaseMaster', pInvoiceData).map(req => req.json());
  }

  getNextInvoiceOrderNo(): Observable<any> {
    return this.http.get('/getPurchaseInvoiceNo').map(req => req.json());
  }

  getExchangeRate(type: any, currencyId: any): Observable<any> {
    return this.http.get('/getExchangeRate/'+ type + '/' + currencyId).map(req => req.json());
  }
  getAddressById(id:any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getAddressById/' +id, options).map(req => req.json());
  }


  getAllOpeningStockLocalPurchaseInvoices(): Observable<any> {
    return this.http.get('/getAllOpeningStockLocalPurchaseInvoices').map(req => req.json());
  }


  addOpeningStockLocalPurchaseInvoice(pInvoiceData: any): Observable<any> {
    return this.http.post('/addOpeningStockLocalPurchaseInvoice', pInvoiceData).map(req => req.json());
  }


  getOpeningStockLocalPurchaseInvoiceById(id:any): Observable<any> {
    return this.http.get('/getOpeningStockLocalPurchaseInvoiceById/' + id).map(req => req.json());
  }
}
