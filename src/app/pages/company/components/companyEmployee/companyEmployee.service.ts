import {Injectable} from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CompanyEmployeeService {

constructor(private http: HttpService) { }

  getData(): Observable<any> {
    return this.http.get('/getAllEmployees').map(req => req.json())
  }

  createEmployee(employeeData: any): Observable<any> {
    var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addEmployee', employeeData, options).map(req => req.json());
  }

  updateEmployee(employeeData: any): Observable<any> {
     var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.put('/updateEmployee', employeeData, options).map(req => req.json());
  }

  getEmployeeById(empId: any): Observable<any> {
    var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getEmployeeById/' + empId, options).map(req => req.json());
  }

  deleteEmployee(empId: number): Observable<any> {
     var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.delete('/deleteEmployeeByID/' + empId, options); //.map(req => req.json());
  }
}
export interface EmployeePartyService {
  empType: string;
  empCode: string;
  commonMasterBySalutationId: string;
  empName: string;
  gender: string;
  anniversaryDate: string;
  dob: string;
  department: number;
  maritalStatus: string;
  panNo: string;
  salary: number;
  subDepartment: number;
  division: number;
  getlocation: number;
  commonMasterByDesignationId: string;
  qualification: string;
  nationality: string;
  itaxNo: string;
  remarks: string;
  doj: string;
  panIssueDate: string;
  panIssuer: string;
  passNo: string;
  passIssueDate: string;
  passExpireDate: string;
  profitRatio: string;
  lossRatio: string;
  authSign: string;

  add11: string;
  add12: string;
  phoneR: number;
  pinCode: number;
  country: string;
  state: string;
  city: string;
  phoneO: number;
  mobile: number;
  email: string;
}
