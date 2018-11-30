import {Injectable} from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ExportSalesOrderService {

  salesOrderData: any;
  constructor(private http: HttpService) { }

  getAllExportSalesOrder(): Observable<any> {
    return this.http.get('/getAllExportSalesOrder').map(req => req.json())
  }

  createExportSalesOrder(salesData: any): Observable<any> {
    return this.http.post('/addExportSalesOrderDetail', salesData).map(req => req.json());
  }

  updateExportSalesOrder(salesData: any): Observable<any> {
     return this.http.put('/updateExportSales', salesData).map(req => req.json());
  }

  getExportSalesOrderById(soId: any): Observable<any> {
    return this.http.get('/getExportSalesById/' + soId).map(req => req.json());
  }

  deleteExportSalesOrder(soId: any): Observable<any> {
    return this.http.delete('/deleteExportSalesByID/' + soId); //.map(req => req.json());
  }

  getOpeningStockStatus():Observable<any>{
    return this.http.get('/isOpenStockEntryComplete').map(req => req.json());
  }
  
  // getAllExportOrderDetailById(soId: any): Observable<any> {
  //   return this.http.get('/getAllExportSalesOrderDetailById/' + soId).map(req => req.json());
  // }

  getAllExportOrdersByTypeAndStatus(type: any, status: any): Observable<any> {
    return this.http.get('/getAllExportSalesOrdersByStatus/' + type + '/' + status).map(req => req.json());
  }

  getAllItemsByLotId(lotId: any): Observable<any[]> {
    return this.http.get('/lot/getAllItemsByLotId/' + lotId).map(req => req.json());
  }

  getAllLotItems(): Observable<any[]> {
    return this.http.get('/lot/getAllLotItem').map(req => req.json());
  }

}

