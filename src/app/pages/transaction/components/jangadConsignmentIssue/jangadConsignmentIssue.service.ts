import {HttpService} from './../../../../core/http/http.service';
import { RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';


@Injectable()
export class JangadConsignmentIssueService {
 constructor(private http: HttpService) {  }

  getAllConsignmentIssue(): Observable <any> {
    return this.http.get('/getAllIssueMasters').map(req => req.json());
  }

  getAllOpeningStockIssue(): Observable <any> {
    return this.http.get('/getAllOpeningIssueMasters').map(req => req.json());
  }

  getConsignmentIssueById(issueId: any): Observable<any> {
    return this.http.get('/getIssueDetailById/' + issueId).map(req => req.json());
  }

  createConsignmentIssue(issueData: any): Observable<any> {
    return this.http.post('/addIssueDetail', issueData).map(req => req.json());
  }

  updateConsignmentIssue(issueData: any): Observable<any> {
    return this.http.put('/updateIssueDetail', issueData).map(req => req.json());
  }

  deleteConsignmentIssue(issueId: any): Observable<any> {
    return this.http.delete('/deleteIssueDetailById/' + issueId); // .map(req => req.json());
  }
  getAddressById(id:any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getAddressById/' +id, options).map(req => req.json());
  }
}

