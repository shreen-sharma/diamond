import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class IssueDetailService {

  constructor(private http: HttpService) {  }
  
  getData(): Observable <any> {
      return this.http.get('/getAllEmpIssueDetails').map(req => req.json());
    }

  createIssueDetails(issueData: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addEmpIssueDetail', issueData, options).map(req => req.json());
  }

  updateIssueDetails(issueData: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.put('/updateEmpIssueDetail', issueData, options).map(req => req.json());
  }

  deleteIssueDetails(empIssId: number): Observable<any> {
    const authHeader = new Headers();
  authHeader.append ('Accept', 'application/json');
  authHeader.append ('Content-Type', 'application/json');
  const options = new RequestOptions({ headers: authHeader });
  return this.http.delete('/deleteEmpIssueDetailByID/' + empIssId, options); // .map(req => req.json());
  }

  getIssueDetailsById(empIssId: any): Observable<any> {
    const authHeader = new Headers();
  authHeader.append ('Accept', 'application/json');
  authHeader.append ('Content-Type', 'application/json');
  const options = new RequestOptions({ headers: authHeader });
  return this.http.get('/getEmpIssueDetailById/' + empIssId, options).map(req => req.json());
  }

}

export interface IssueDetail {
  employee: string;
  process: string;
  lot: string;
  issueDate: string;
  issueNo: string,
}
