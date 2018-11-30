import { RequestOptions, Headers } from '@angular/http';
import { HttpService } from '../../../../core/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CategoryService {

  constructor(private http: HttpService) {

  }

  getData(): Observable<any> {
    return this.http.get('/getAllCategories').map(req => req.json());
  }

  createLot(lotData: any): Observable<any> {
    var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addCategory', lotData, options).map(req => req.json());
  }

  updateLot(lotData: any): Observable<any> {
     var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.put('/updateCategory', lotData, options).map(req => req.json());
  }

  deleteLot(lotData: any): Observable<any> {
     var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.delete('/deleteCategory', lotData, options)//.map(req => req.json());
  }
}
