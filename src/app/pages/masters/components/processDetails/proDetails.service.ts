import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import { HttpService } from '../../../../core/http';
import { RequestOptions, Headers } from '@angular/http';
@Injectable()
export class ProDetailService {

  constructor(private http: HttpService) {}

    getData(): Observable<any> {
      return this.http.get('/getAllprocessDetails').map(req => req.json());
    }

    getProcessDetailsById(processId: any): Observable<any> {
      const authHeader = new Headers();
      authHeader.append ('Accept', 'application/json');
      authHeader.append ('Content-Type', 'application/json');
      const options = new RequestOptions({ headers: authHeader });
      return this.http.get('/getProcessDetailById/' + processId, options).map(req => req.json());
    }

    createProcessDetails(proData: any): Observable<any> {
      var authHeader = new Headers();
      authHeader.append ('Accept', 'application/json');
      authHeader.append ('Content-Type', 'application/json');
      const options = new RequestOptions({ headers: authHeader });
      return this.http.post('/addProcessDetail', proData, options).map(req => req.json());
    }

    updateProcessDetails(proData: any): Observable<any> {
      var authHeader = new Headers();
      authHeader.append ('Accept', 'application/json');
      authHeader.append ('Content-Type', 'application/json');
      const options = new RequestOptions({ headers: authHeader });
      return this.http.put('/updateProcessDetail', proData, options).map(req => req.json());
    }

    deleteProcessDetails(processId: string): Observable<any> {
      var authHeader = new Headers();
      authHeader.append ('Accept', 'application/json');
      authHeader.append ('Content-Type', 'application/json');
      const options = new RequestOptions({ headers: authHeader });
      return this.http.delete('/deleteProcessDetailByID/' + processId, options)//.map(req => req.json());
    }
}

export interface ProcessDetails {
   id?: string;
   processType: string;
   name: string;
   code: string;
   chargeRequired: boolean;

}
