import {Injectable} from '@angular/core';
import {HttpService } from '../../../../core/http';
import {Observable } from 'rxjs/Rx';
import { RequestOptions, Headers } from '@angular/http';

@Injectable()
export class ParaListService {

 constructor(private http: HttpService) {

  }

  getData(): Observable<any[]> {
    return this.http.get('/getAllParameterMaster').map(req => req.json())
  }

  createParaList(paraListData: any): Observable<any> {
    debugger;
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addParameterMaster', paraListData, options).map(req => req.json());
  }

  updateParaList(paraListData: any): Observable<any> {
     const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.put('/updateParameterMaster', paraListData, options).map(req => req.json());
  }

  deleteParaList(paramId: string): Observable<any> {
     const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.delete('/deleteParameterMaster/' + paramId, options); // .map(req => req.json());
  }
}
