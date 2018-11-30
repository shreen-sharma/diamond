import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Injectable} from '@angular/core';

@Injectable()
export class LocalSaleService {

  orderNo: Number;
  orderDate: String;
  partyName: String;

  constructor(private http: HttpService) { }
  
  getSalesInvoiceData(): Observable<any> {
    return this.http.get('/getAllLocalSalesDetails').map(req => req.json());
  }

  getSalesOrderData(): Observable<any> {
    return this.http.get('/getAllLocalSalesOrderDetails').map(req => req.json());
  }

  getSalesOrderById(soId: any): Observable<any> {
    // var authHeader = new Headers();
    // authHeader.append ('Accept', 'application/json');
    // authHeader.append ('Content-Type', 'application/json');
    // const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getLocalSalesOrderDetailById/' + soId).map(req => req.json());
  }

  getAllLotItems(): Observable<any[]> {
    return this.http.get('/lot/getAllLotItem').map(req => req.json());
  }

  createSalesInvoice(invoiceData: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addLocalSalesDetail', invoiceData, options).map(req => req.json());
  }

  getSalesInvoiceDataById(locSaleId:any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getLocalSalesDetailById/' +locSaleId, options).map(req => req.json());
  }

  deleteSalesOrderInvoiceById(pInvoiceId: any): Observable<any> {
    return this.http.delete('/deleteLocalSalesDetailByID', pInvoiceId)//.map(req => req.json());
  }

  getAllCurrencies(): Observable<any> {
    return this.http.get('/getAllCurrencies').map(req => req.json())
  }

  getAllCommonMasterByType(itemType: string): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getAllCommonMasterByType/' + itemType, options).map(req => req.json())
  }

  getNextInvoiceOrderNo(): Observable<any> {
    return this.http.get('/getSalesInvoiceNo').map(req => req.json());
  }

  getAllSalesOrdersByTypeAndStatus(type: string, status: string): Observable<any> {
    return this.http.get('/getAllLocalSalesOrderByStatus/' + type + '/' + status).map(req => req.json());
  }

  getAddressById(id:any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getAddressById/' +id, options).map(req => req.json());
  }


  getAllOpeningStockLocalSalesOrderInvoice(): Observable<any> {
    return this.http.get('/getAllOpeningStockLocalSalesOrderInvoice').map(req => req.json());
  }

  addOpeningStockLocalSalesOrderInvoice(invoiceData: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addOpeningStockLocalSalesOrderInvoice', invoiceData, options).map(req => req.json());
  }
  
  getOpeningStockLocalSalesOrderInvoiceById(locSaleId:any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getOpeningStockLocalSalesOrderInvoiceById/' +locSaleId, options).map(req => req.json());
  }

}
