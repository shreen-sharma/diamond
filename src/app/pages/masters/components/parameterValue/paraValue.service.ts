import {Injectable} from '@angular/core';
import { HttpService } from '../../../../core/http';
import { Observable } from 'rxjs/Rx';
import { RequestOptions, Headers } from '@angular/http';

@Injectable()
export class ParaValueService {

  constructor(private http: HttpService) {

  }

  getData(): Observable<any> {
    return this.http.get('/getAllParameterValue').map(req => req.json())
  }

  getParameterValuesOfParameter(parameterId: number): Observable<any> {
    return this.http.get('/getParamValues/' + parameterId).map(req => req.json())
  }

  createParaValue(paraValueData: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addParameterValue', paraValueData, options).map(req => req.json());
  }

  updateParaValue(paraValueData: any): Observable<any> {
     const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.put('/updateParameterValue', paraValueData, options).map(req => req.json());
  }

  deleteParaValue(paraValueData: any): Observable<any> {
    debugger;
     const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.delete('/deleteParameterValue/' + paraValueData, paraValueData, options);
  }
}
