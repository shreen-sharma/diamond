import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class ItemMergingService {

  constructor(private http: HttpService) {  }

  getAllItemMerge(): Observable <any> {
    return this.http.get('/getAllLotTransaction').map(req => req.json());
  }

  getAllLotTransactionByTransTypeAndInvoiceType(transType: any, invoiceType: any): Observable<any> {    
    return this.http.get('/getAllLotTransactionByTransTypeAndInvoiceType/' + transType + '/' + invoiceType).map(req => req.json());
  }

  createItemMerge(itemData: any): Observable<any> {    
    return this.http.post('/addItemMerge', itemData).map(req => req.json());
  }

  updateItemMerge(itemData: any): Observable<any> { 
    return this.http.put('/updateItemMerge', itemData).map(req => req.json());
  }

  deleteItemMerge(lotTransId: any): Observable<any> {
    return this.http.delete('/deleteItemMergeById/' + lotTransId); // .map(req => req.json());
  }

  getItemMergeById(lotTransId: any): Observable<any> {    
    return this.http.get('/getItemMergeById/' + lotTransId).map(req => req.json());
  }
}

