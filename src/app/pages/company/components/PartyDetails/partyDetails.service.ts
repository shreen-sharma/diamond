import {Injectable} from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PartyDetailsService {

constructor(private http: HttpService) {

      }
  // lotData = [
  //   {
  //     id: 1,
  //     lotName: 'Mark',
  //     lotCode: 'Otto',
  //     creationDate: '12-12-12'
  //   },
  // ];

  getData(): Observable<any> {
    return this.http.get('/getAllParties').map(req => req.json())
  }

  getAllPartyTypes(): Observable<any> {
    return this.http.get('/getAllPartyTypes').map(req => req.json())
  }


  createParty(partyData: any): Observable<any> {
    var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.post('/addParty', partyData, options).map(req => req.json());
  }

  updateParty(partyData: any): Observable<any> {
     var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.put('/updateParty', partyData, options).map(req => req.json());
  }

  getPartyById(partyId: any): Observable<any> {
    var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getPartyById/' + partyId, options).map(req => req.json());
  }

  //getAllBankBranchByPartyId
  getAllBankBranchByPartyId(partyId: string, partyType: string,): Observable<any> {
    return this.http.get('/getAllBankBranchByPartyId/' + partyType + '/' + partyId).map(req => req.json());
  }

  getPartyByType(partyType: string): Observable<any> {
    var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.get('/getAllPartyEntityByType/' + partyType, options).map(req => req.json());
  }

  deleteParty(partyId: number): Observable<any> {
     var authHeader = new Headers();
    authHeader.append ('Accept', 'application/json');
    authHeader.append ('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: authHeader });
    return this.http.delete('/deletePartyByID/' + partyId, options); //.map(req => req.json());
  }
}
export interface PartyService {
   partyType: string;
  salutation: number;
  partyCode: string;
  partyName: string;
  commonMasterByCompTypeId: number;
  currencyMasterDTO: number;
  commonMasterByBussNatureId: number;
  fidNo: string;
  partyStatus: string;
  creditLimit: number;
  commonMasterByTermsId: number;
  // defaultDischargePort: string;
  // defaultVessel: string;
  partyNo: number;
  remarks: string;
  // partyAccCode: string;
  // partyAccDesc: string;
  // selectVessel: string;
  // vesselRemark: string;
  // availableVesselDetails: string;
  // vesselDetail: string;

  // selectBankBranch: string;
  // bankAddress: string;
  // bankersNote: string;
  // availableBankDetails: string;
 

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
