import {Injectable} from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContactPersonService {

  constructor(private http: HttpService) {  }

  getData(): Observable<any> {
    return this.http.get('/getAllPersonMaster').map(req => req.json())
  }

  getPersonById(personId: any): Observable<any> {
    return this.http.get('/getPersonMasterById/' + personId).map(req => req.json());
  }


  createContactPerson(contactPerson: any): Observable<any> {

    return this.http.post('/addPersonMaster', contactPerson).map(req => req.json());
  }

  updateContactPerson(contactPerson: any): Observable<any> {
    return this.http.put('/updatePersonMaster', contactPerson).map(req => req.json());
  }

  deleteContactPerson(personId: number): Observable<any> {
    return this.http.delete('/deletePersonMaster/' + personId); 
  }
}
export interface ContactPerson {

  refType: string;
  personCode: string;
  commonMasterBySalutationId: string;
  personName: string;
  gender: string;
  marritalStatus: string;
  dob: string;
  anniversaryDate: string;
  nationality: string;
  commonMasterByDesignationId: string;
  qualification: string;
  remark: string;

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

