import { Observable } from 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';


@Injectable()
export class ExportInvoiceService {

  expOrderNo: Number;
  expOrderDate: String;
  partyName: String;

  constructor(private http: HttpService) { }
  
  getAllExportOrdersByTypeAndStatus(type: string, status: string): Observable<any> {
    return this.http.get('/getAllExportSalesOrdersByStatus/' + type + '/' + status).map(req => req.json());
  }

  getAllExportInvoice(): Observable<any> {
    return this.http.get('/getAllExportMaster').map(req => req.json());    
  }

  getAllExportSalesOrder(): Observable<any> {
    return this.http.get('/getAllExportSalesOrder').map(req => req.json());
  }

  getExportSalesOrderById(soId: any): Observable<any> {
    return this.http.get('/getExportSalesById/' + soId).map(req => req.json());
  }

  getExportInvoiceById(expId: any): Observable<any> {
    return this.http.get('/getExportMasterById/' + expId).map(req => req.json());
  }

  createExportInvoice(invoiceData: any): Observable<any> {
    return this.http.post('/addExportMaster', invoiceData).map(req => req.json());
  }
 
  deleteExportInvoiceById(expId: any): Observable<any> {
    return this.http.delete('/deleteExportMasterByID/' + expId); // .map(req => req.json());
  }

  getAllCommonMasterByType(itemType: string): Observable<any> {
    return this.http.get('/getAllCommonMasterByType/' + itemType).map(req => req.json())
  }
  
  getAddressById(id:any): Observable<any> {
    return this.http.get('/getAddressById/' + id).map(req => req.json());
  }

  addOpeningStockExportSalesOrderInvoice(invoiceData: any): Observable<any> {
    return this.http.post('/addOpeningStockExportSalesOrderInvoice', invoiceData).map(req => req.json());
  }

  getOpeningStockExportSalesOrderInvoiceById(expId: any): Observable<any> {
    return this.http.get('/getOpeningStockExportSalesOrderInvoiceById/' + expId).map(req => req.json());
  }

  getAllOpeningStockExportSalesOrderInvoice(): Observable<any> {
    return this.http.get('/getAllOpeningStockExportSalesOrderInvoice').map(req => req.json());    
  }
}
