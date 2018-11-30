import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestOptions, Headers } from '@angular/http';
import { HttpService } from '../../../../core/http';

@Injectable()
export class ProTypeService {

  constructor(private http: HttpService) {

      }

  getData(): Observable<any> {
    return this.http.get('/getAllProcessType').map(req => req.json())
  }

  createProType(proTypeData: any): Observable<any> {
    var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addProcessType', proTypeData, options).map(req => req.json());
  }

  updateProType(proTypeData: any): Observable<any> {
     var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.put('/updateProcessType', proTypeData, options).map(req => req.json());
  }

  deleteProType(processTypeId: string): Observable<any> {
     var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.delete('/deletePocessType/' + processTypeId, options); // .map(req => req.json());
  }

}
