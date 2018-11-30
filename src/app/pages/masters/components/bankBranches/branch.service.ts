import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class BranchService {

  constructor(private http: HttpService) { }

  getData(): Observable <any> {
    return this.http.get('/getAllBankBranches').map(req => req.json());
  }

  createBranch(branchData: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addBankBranch', branchData, options).map(req => req.json());
  }

  updateBranch(branchData: any): Observable<any> {
    const authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.put('/updateBankBranch', branchData, options).map(req => req.json());
  }

  deleteBranch(bankBrId: number): Observable<any> {
    const authHeader = new Headers();
  authHeader.append ('Accept', 'application/json');
  authHeader.append ('Content-Type', 'application/json');
  const options = new RequestOptions({ headers: authHeader });
  return this.http.delete('/deleteBankBranchesByBankId/' + bankBrId, options); // .map(req => req.json());
  }

  getBankBranchById(bankBrId: any): Observable<any> {
    const authHeader = new Headers();
  authHeader.append ('Accept', 'application/json');
  authHeader.append ('Content-Type', 'application/json');
  const options = new RequestOptions({ headers: authHeader });
  return this.http.get('/getBankBranchById/' + bankBrId, options).map(req => req.json());
  }

  // getBranchesByBankId(bankBranchMasterId: string): Observable <any> {
  //   const authHeader = new Headers();
  //   authHeader.append ('Accept', 'application/json');
  //   authHeader.append ('Content-Type', 'application/json');
  //   const options = new RequestOptions({ headers: authHeader });
  //   return this.http.get('/getAllBankBranchesByBankId', bankBranchMasterId).map(req => req.json());
  // }

}

export interface Branch {
  bankId: string;
  bankBrName: string;
  bankBrCode: string;
  bankStatus: string;
  natureOfBusiness: string;
  bankType: string;
  fidNo: string;
  routingNo: string;
  swiftNo: string;
  telexNo: string;
  websiteAddress: string;
  note: string;
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
}



