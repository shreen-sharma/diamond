import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class ItemAllotmentService {

constructor(private http: HttpService) { }

  getItemAllotmentData(): Observable<any> {
    return this.http.get('/getAllLotTransaction').map(req => req.json())
  }

  getAllLotTransactionByTransTypeAndInvoiceType(transType: any, invoiceType: any): Observable<any> {
    return this.http.get('/getAllLotTransactionByTransTypeAndInvoiceType/' + transType + '/' + invoiceType).map(req => req.json());
  }

  createItemAllotment(itemData: any): Observable<any> {
    return this.http.post('/addItemAllotment', itemData).map(req => req.json());
  }

  updateItemAllotment(itemData: any): Observable<any> {
    return this.http.put('/updateItemAllotment', itemData).map(req => req.json());
  }

  getItemAllotmentById(lotTransId: any): Observable<any> {
    return this.http.get('/getItemAllotmentById/' + lotTransId).map(req => req.json());
  }

  deleteItemAllotmentById(lotTransId: number): Observable<any> {
    return this.http.delete('/deleteItemAllotmentById/' + lotTransId); //.map(req => req.json());
  }
}

