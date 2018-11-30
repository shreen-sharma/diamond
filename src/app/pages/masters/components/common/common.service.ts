import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestOptions, Headers } from '@angular/http';
import { HttpService } from '../../../../core/http';

@Injectable()
export class CommonService {

constructor(private http: HttpService) {  }


  // getData(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve(this.commonData);
  //     }, 2000);
  //   });
  // }

  getAllCommonMaster(): Observable<any> {
    return this.http.get('/getAllCommonMaster').map(req => req.json()) }


 getCommonMasterById(id: number): Observable<any> {
    return this.http.get('/getCommonMasterById/' + id).map(req => req.json())
  }

  getAllCommonMasterByType(itemType: string): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getAllCommonMasterByType/' + itemType, options).map(req => req.json())
  }

  createCommon(common: any): Observable<any> {
   const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addCommonMaster', common, options).map(req => req.json());
  }
  updateCommon(common: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append('Accept', 'application/json');
    authHeader.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: authHeader});
    return this.http.put('/updateCommonMaster', common, options).map(req => req.json());
  }

  deleteCommon(commonMasterId: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append('Accept', 'application/json');
    authHeader.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: authHeader});
    return this.http.delete('/deleteCommonMasterByID', commonMasterId, options); // .map(req => req.json());
  }
}
