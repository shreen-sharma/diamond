import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import { HttpService } from '../../../../core/http';
import { RequestOptions, Headers } from '@angular/http';

@Injectable()
export class ItemDetailsService {

  constructor(private http: HttpService) {}

  getData(): Observable<any> {
    return this.http.get('/getAllItems').map(req => req.json())
  }

  getAllItemsByCategoryId(catId: any): Observable<any> {
    return this.http.get('/getAllItemsByCategoryId/' + catId).map(req => req.json());
  }

  getItemDetailsById(itemId: any): Observable<any> {
    return this.http.get('/getItemById/' + itemId).map(req => req.json());
  }

  createItemDetails(itemDetailsId: any): Observable<any> {
   return this.http.post('/addItem', itemDetailsId).map(req => req.json());
  }

  updateItemDetails(itemDetailsId: any): Observable<any> {
   return this.http.put('/updateItem', itemDetailsId).map(req => req.json());
  }

  deleteItemDetails(itemId: number): Observable<any> {
    return this.http.delete('/deleteItem/' + itemId);
  }

  checkItemIdExistInLotItem(itemId: any): Observable<any> {
    return this.http.get('/lot/checkItemIdExistInLotItem/' + itemId).map(req => req.json());
  }

}

export interface ItemDetail {
  id?: string;
  itemCategory: string;
  itemName: string;
  itemCode: string;
  itemDesc: string;
  costPrice: number;
  salePrice: number;
  taxable: boolean;

}
