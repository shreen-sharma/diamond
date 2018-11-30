import {Injectable} from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SalesOrderService {

  perchOrderData: any;
  constructor(private http: HttpService) {

  }

  // getData(): Observable<any> {
  //   return this.http.get('/getAllParties').map(req => req.json())
  // }

  getSalesOrderData(): Observable<any> {
   return this.http.get('/getAllLocalSalesOrderDetails').map(req => req.json())
   }


  createSalesOrder(partyData: any): Observable<any> {
    var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addLocalSalesOrderDetail', partyData, options).map(req => req.json());
  }

  updateSalesOrder(partyData: any): Observable<any> {
     var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.put('/updateLocalSalesOrderDetail', partyData, options).map(req => req.json());
  }

  getSalesOrderById(soId: any): Observable<any> {
    var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getLocalSalesOrderDetailById/' + soId, options).map(req => req.json());
  }

  deleteSalesOrder(soId: number): Observable<any> {
       return this.http.delete('/deleteLocalSalesOrderDetailByID/' + soId); //.map(req => req.json());
  }
  getAllLotItems(): Observable<any[]> {
    return this.http.get('/lot/getAllLotItem').map(req => req.json());
  }

  getOpeningStockStatus():Observable<any>{
    return this.http.get('/isOpenStockEntryComplete').map(req => req.json());
  }
  getNextSalesOrderNo(): Observable<any> {
    return this.http.get('/getNextSalesOrderNo').map(req => req.json());
  }
  getExchangeRate(type:string, currencyId:number): Observable<any> {
    return this.http.get('/getExchangeRate/'+type +'/'+currencyId).map(req => req.json());
  }

  getAllLocalSalesOrderStockItemsReportLotwise(soId: number): Observable<any>{
    return this.http.get('/getAllLocalSalesOrderStockItemsReportLotwise/'+soId).map(req => req.json());
  }

  localSalesOrderEstimateDistinctSizeReport(soId: number): Observable<any>{
    return this.http.get('/localSalesOrderEstimateDistinctSizeReport/'+soId).map(req => req.json());
  }

  localSalesOrderEstimateSizeReport(soId: number): Observable<any>{
    return this.http.get('/localSalesOrderEstimateSizeReport/'+soId).map(req => req.json());
  }
  getLatestLocSalesOrdersOfCustomer(soId: number): Observable<any> {
    return this.http.get('/getLatestLocSalesOrdersOfCustomer/' +soId).map(req => req.json());
  }
}
export interface SalesOrders {
  soNo: string;
  category: string;
  soDate: string;
  partyNote: string;
  bankerNote: string;
  cbbDueDate: string;
  bankCrDays: number;
  notifierNote: string;
  vesselRemark: string;
  reassortPerc: number;
  reassortCharge: number;
  netAmount: number;
  item: string;
  itemDesc: string;
  pcs: number;
  pcs1: string;
  pcsCts: number;
  carets: number;
  rate: number;
  amount: number;
  pklistStatus: string;
}
