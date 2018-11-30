import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Injectable} from '@angular/core';

@Injectable()
export class OpeningStockEntryService {

  toggle: any = false;

  constructor(private http: HttpService) { }

  getAllOpeningStockEntry(): Observable<any[]> {
    return this.http.get('/getAllOpeningStockCategory').map(req => req.json());
  }

  createOpeningStockEntry(openData: any): Observable<any> {
    return this.http.post('/addOpeningStockCategory', openData).map(req => req.json());
  }

  updateOpeningStockEntry(openData: any): Observable<any> {
   return this.http.put('/updateOpeningStockCategory', openData).map(req => req.json());
  }

  deleteOpeningStockEntry(osId: number): Observable<any> {
    return this.http.delete('/deleteOpeningStockCategory/' + osId);
  }

  getOpeningStockEntryById(osId: any): Observable<any> {
   return this.http.get('/getOpeningStockCategoryById/' + osId).map(req => req.json());
  }

  processOpenStockEntries(): Observable<any> {
    return this.http.get('/completeOpeningStockProcess').map(req => req.json());
   }
   getAllLotTransactionByTransType(transType: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getAllLotTransactionByTransType/' + transType, options).map(req => req.json());
  }
  getAllLotItemCreation(): Observable<any> {
    return this.http.get('/lot/getAllLotItem').map(req => req.json());
  }
}

export interface OpeningStockEntrys {
  catId: string;
  totalCarets: string;
  avgRate: string;
  amount: string;
  lotName: string;
  itemName: string;
  carats: string;
  rate: string;
  totaladdedCarats: string;
  lotItemDetail: string;
}

