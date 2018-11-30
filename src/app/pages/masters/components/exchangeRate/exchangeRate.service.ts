import {Injectable} from '@angular/core';
import { HttpService } from '../../../../core/http';
import { Observable } from 'rxjs/Rx';
import { RequestOptions, Headers } from '@angular/http';

@Injectable()
export class ExchangeRateService {

  constructor(private http: HttpService) {  }

      getData(): Observable<any> {
        return this.http.get('/getAllCustomExchangeRates').map(req => req.json())
      }

      getCustomExchangeRateById(customExchId: any): Observable<any> {
        const authHeader = new Headers();
        authHeader.append ('Accept', 'application/json');
        authHeader.append ('Content-Type', 'application/json');
        const options = new RequestOptions({ headers: authHeader });
        return this.http.get('/getCustomExchRateById/' + customExchId, options).map(req => req.json());
      }

      addCustomExchangeRate(rateData: any): Observable<any> {
        const authHeader = new Headers();
        authHeader.append ('Accept', 'application/json');
        authHeader.append ('Content-Type', 'application/json');
        const options = new RequestOptions({ headers: authHeader });
        return this.http.post('/addCustomExchRate', rateData, options).map(req => req.json());
      }

      updateCustomExchangeRate(rateData: any): Observable<any> {
        const authHeader = new Headers();
        authHeader.append ('Accept', 'application/json');
        authHeader.append ('Content-Type', 'application/json');
        const options = new RequestOptions({ headers: authHeader });
        return this.http.put('/updateCustomExchRate', rateData, options).map(req => req.json());
      }

      deleteCustomExchangeRate(customExchId: any): Observable<any> {
        const authHeader = new Headers();
        authHeader.append ('Accept', 'application/json');
        authHeader.append ('Content-Type', 'application/json');
        const options = new RequestOptions({ headers: authHeader });
        return this.http.delete('/deleteCustomExchRateById/' + customExchId, options) // .map(req => req.json());
      }
    }
