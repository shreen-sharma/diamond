import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class ItemTransferService {

  constructor(private http: HttpService) {  }

  getAllItemTransfer(): Observable <any> {
    return this.http.get('/getAllLotTransactionByTransTypeAndInvoiceType/SA/LT').map(req => req.json());
  }

  getItemTransferById(lotTransId: string): any {
    return this.http.get('/getLotTransactionById/' + lotTransId).map(req => req.json());
  }

  createItemTransfer(itemData: any): Observable<any> {
    return this.http.post('/processItemTransfer', itemData);
  }

  updateItemTransfer(itemData: any): Observable<any> {
    return this.http.put('/updatelotTransaction', itemData).map(req => req.json());
  }
  deleteItemTransfer(lotTransactionId: number): Observable<any> {
    return this.http.delete('/deleteLotTransaction/' + lotTransactionId); //.map(req => req.json());
  }
}
