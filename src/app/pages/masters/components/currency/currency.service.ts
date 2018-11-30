import { RequestOptions, Headers } from '@angular/http';
import { HttpService } from '../../../../core/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CurrencyService {

  currencyData: any[] = [];
  constructor(private http: HttpService) {

  }

  getAllCurrencies(): Observable<any> {
    return this.http.get('/getAllCurrencies').map(req => req.json())}

  addCurrency(currency: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addCurrency', currency, options).map(req => req.json());
  }

  updateCurrency(currency: any): Observable<any> {
     const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.put('/updateCurrency', currency, options).map(req => req.json());
  }

  deleteCurrency(currId: any): Observable<any> {
     const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.delete('/deleteCurrencyByID', currId, options) // .map(req => req.json());
  }
}
