import { any } from 'codelyzer/util/function';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HierarchyRelationService {
  options: RequestOptions;
  constructor(private http: HttpService) {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: authHeader });
  }

  getData(): Observable<any> {
    return this.http.get('/getAllHierarchyRelation').map(req => req.json())
  }

  createHier(hierData: any): Observable<any> {
    return this.http.post('/addHierarchyRelation', hierData, this.options).map(req => req.json());
  }

  //GET /getHierarchyRelationByParentId
  getHierarchyRelationByParentId(parentId: string): Observable<any> {
    return this.http.get('/getHierarchyRelationByParentId/' + parentId, this.options).map(req => req.json());
  }
  
  updateHier(hierData: any): Observable<any> {
     return this.http.put('/updateHierarchyRelation', hierData, this.options).map(req => req.json());
  }

  getHierById(hierRelId: any): Observable<any> {
    return this.http.get('/getHierarchyRelationById/' + hierRelId, this.options).map(req => req.json());
  }

  deleteHier(hierRelId: any): Observable<any> {
     return this.http.delete('/deleteHierarchyRelation/' + hierRelId, this.options); //.map(req => req.json());
  }

  getHierMasterById(hierId: any): Observable<any> {
    return this.http.get('/getHierarchyMasterById/' + hierId, this.options).map(req => req.json());
  }

}

export interface Hierarchy {
  compName: string;
  division: string;
  location: string;
  department: string;
  subDepartment: string;
  companyDetail: string;
  availDiv: string;
  availLoc: string;
  availDept: string;
  availSubDept: string;
}

