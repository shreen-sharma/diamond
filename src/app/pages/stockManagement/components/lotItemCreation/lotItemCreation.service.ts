import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class LotItemCreationService {
  perchOrderData: any;

  authenticationService: AuthenticationService;

    constructor(private http: HttpService, private authService: AuthenticationService) {
     this.authenticationService = authService;
    }


  getAllLotItemCreation(): Observable<any> {
    return this.http.get('/lot/getAllLotItem').map(req => req.json());
  }

  createLotItemCreation(lotData: any): Observable<any> {
    return this.http.post('/lot/addLotItems', lotData).map(req => req.json());
  }

  updateLotItemCreation(lotData: any): Observable<any> {
    return this.http.put('/lot/updateLotItems', lotData).map(req => req.json());
  }

  deleteLotItemCreation(lotItemId: number): Observable<any> {
    return this.http.delete('/lot/deleteLotItem/' + lotItemId);
  }

  getLotItemCreationById(lotItemId: any): Observable<any> {
    return this.http.get('/lot/getLotItemById/' + lotItemId).map(req => req.json());
  }

  getAllLotItemByLotId(lotId: any): Observable<any> {
    return this.http.get('/lot/getAllItemsByLotId/' + lotId).map(req => req.json());
  }
  getAllLotItem(): Observable <any> {
    return this.http.get('/getAllLotTransaction').map(req => req.json());
  }

  getAvailableLotItemsForStockEntryByLotId(lotId: any): Observable<any> {
    return this.http.get('/lot/getAvailableLotItemsForStockEntryByLotId/' + lotId).map(req => req.json());
  }
}

export interface LotItemCreation {
  lot: string;
  itemCategory: string;
  creationDate: string;
  itemNotAvailableLot: string;
}
