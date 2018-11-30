import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';


@Injectable()
export class PhysicalStockAdjustmentService {

  constructor(private http: HttpService) {  }

  getAllPhysicalStockAdjust(): Observable<any>{
    return this.http.get('/getAllPhysicalStockAdjust').map(req => req.json());
  }

  getAllLotTransactionByTransType(transType: any): Observable<any> {
    return this.http.get('/getAllLotTransactionByTransType/' + transType).map(req => req.json());
  }

  createStockAdjustment(itemData: any): Observable<any> {
    return this.http.post('/addPhysicalAdjust', itemData).map(req => req.json());
  }

  getStockAdjustmentById(lotTransId: any): Observable<any> {
    return this.http.get('/getItemMergeById/' + lotTransId).map(req => req.json());
  }

  getCheckInvoiceTypeExist(invoiceType: any, invoiceNo: any): Observable<any> {
    return this.http.get('/checkInvoiceExist/' + invoiceType +  '/' + invoiceNo).map(req => req.json());
  }


}

