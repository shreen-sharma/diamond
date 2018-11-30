import { RequestOptions, Headers } from '@angular/http';
import { HttpService } from '../../../../core/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class LotService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
   this.authenticationService = authService;
  }

  getData(): Observable<any> {
    return this.http.get('/lot/getAllLots').map(req => req.json())
    /* return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.lotData);
      }, 2000);
    }); */
  }

  createLot(lotData: any): Observable<any> {
       return this.http.post('/lot/addLot', lotData).map(req => req.json());
  }

  updateLot(lotData: any): Observable<any> {
    return this.http.put('/lot/updateLot', lotData).map(req => req.json());
  }

  deleteLot(lotId: any): Observable<any> {
    return this.http.delete('/lot/deleteLot/' + lotId); // .map(req => req.json());
  }

}
