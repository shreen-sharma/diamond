import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';


@Injectable()
export class JangadConsignmentReturnService {

  constructor(private http: HttpService) { }

  getAllJangadCNReturn(): Observable<any> {
    return this.http.get('/getAllReturnDetails').map(req => req.json());
  }

  getJangadCNReturnById(returnId: any): Observable<any> {
    return this.http.get('/getReturnDetailById/' + returnId).map(req => req.json());
  }

  getAllReturnDetailDataByIssueNo(issueNo: any): Observable<any> {
    return this.http.get('/getAllByIssueNo/' + issueNo).map(req => req.json());                    // check this
  }

  getAllReturnDetailsByIssueNoAndLotItemId(issueNo: any, lotItemId: any): Observable<any> {
    return this.http.get('/getAllReturnDetailsByIssueNoAndLotItemId/' + issueNo + '/' + lotItemId).map(req => req.json());  // check this
  }

  createJangadCNReturn(returnData: any): Observable<any> {
    return this.http.post('/addReturnDetail', returnData).map(req => req.json());
  }

  updateJangadCNReturn(returnData: any): Observable<any> {
    return this.http.post('/updateReturnDetail', returnData).map(req => req.json());
  }

  deleteJangadCNReturn(returnId: any): Observable<any> {
    return this.http.delete('/deleteReturnDetailById/' + returnId);
  }

  getAllIssueMasters(): Observable<any> {
    return this.http.get('/getAllIssueMasters').map(req => req.json());
  }

  getAllIssueMastersByStatus(): Observable<any> {         // NOT_CLOSED & IN_PROCESS
    return this.http.get('/getAllActiveIssuesStatus').map(req => req.json());         // check this also
  }

  getIssueDetailById(issueId: any): Observable<any> {
    return this.http.get('/getIssueDetailById/' + issueId).map(req => req.json());
  }

  getAllIssueDetailDataByIssueId(issueId: any): Observable<any> {
    return this.http.get('/getAllIssueDetailByMasterId/' + issueId).map(req => req.json());
  }
  getAddressById(id:any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getAddressById/' +id, options).map(req => req.json());
  }
}
