import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HierarchyCreationService {

  constructor(private http: HttpService) {

      }
  getData(): Observable<any> {
    return this.http.get('/getAllHierarchyMaster').map(req => req.json());

  }

  createHier(hierData: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addHierarchyMaster', hierData, options).map(req => req.json());
  }

  updateHier(hierId: number, hierData: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.put('/updateHierarchyMaster/' + hierId, hierData, options).map(req => req.json());
  }

  getHierById(hierId: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getHierarchyMasterById/' + hierId, options).map(req => req.json());
  }

  deleteHier(hierData: number): Observable<any> {
     const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.delete('/deleteHierarchyMaster/' + hierData,  options);
  }

  getAllHierachyByType(hierType: string): Observable<any> {
    const authHeader = new Headers();
   authHeader.append ('Accept', 'application/json');
   authHeader.append ('Content-Type', 'application/json');
   const options = new RequestOptions({ headers: authHeader });
   return this.http.get('/getAllHierarchyMasterByHierType/' + hierType, options).map(req => req.json());
 }

 //GET /getAllHierarchyMaster
 getAllHierachy(): Observable<any> {
  const authHeader = new Headers();
  authHeader.append ('Accept', 'application/json');
  authHeader.append ('Content-Type', 'application/json');
  const options = new RequestOptions({ headers: authHeader });
  return this.http.get('/getAllHierarchyMaster/', options).map(req => req.json());
  }
}

export interface Hierarchy {
  hierType: string;
  hierName: string;
  hierCode: string;
  add11: string;
  add12: string;
  country: string;
  city: string;
  state: string;
  pinCode: number;
  phoneR: number;
  phoneO: number;
  mobile: number;
  email: string;
  estabDate: string;
  gSTNo: string;
  currencyMasterByCurrId: string;
  currencyMasterByStockCurrId: string;
  commonMasterByBussNatureId: string;
  commonMasterByBussTypeId: string;
  commonMasterByFirmNatureId: string;
  decPlace: string;
  finMonth: string;
}

