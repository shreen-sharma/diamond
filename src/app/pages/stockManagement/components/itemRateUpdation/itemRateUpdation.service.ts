import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';

@Injectable()
export class ItemRateUpdationService {

  constructor(private http: HttpService) {  }

  getAllItemRateUpdation(): Observable <any> {
    return this.http.get('/getAllLotItemsUpdated').map(req => req.json());
  }

  createItemRateUpdation(itemData: any): Observable<any> {
    return this.http.post('/addItemsRate', itemData).map(req => req.json());
  }

  updateItemRateUpdation(itemData: any): Observable<any> {
    return this.http.put('/updateItemsRate', itemData).map(req => req.json());
  }

  deleteItemRateUpdation(lotTransId: number): Observable<any> {
    return this.http.delete('/deleteItemRateUpdationById/' + lotTransId); // .map(req => req.json());
  }
}

