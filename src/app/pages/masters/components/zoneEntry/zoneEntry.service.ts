import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class ZoneEntryService {

  geoEditData: any;
  constructor(private http: HttpService) { }

  getAllZones(): Observable<any> {

    return this.http.get('/getGeoMasterByType/ZO').map(req => req.json())}

  getAllCountries(): Observable<any> {
    return this.http.get('/getGeoMasterByType/CM').map(req => req.json())}

    getAllCitiesOfState(stateId: number): Observable<any> {
      return this.http.get('/getAllgeoMasterByParentId/' + stateId).map(req => req.json())
     }

     getAllStatesOfCountry(countryId: number): Observable<any> {

      return this.http.get('/getAllgeoMasterByParentId/' + countryId).map(req => req.json())
     }

  updateCurrency(currency: any): Observable<any> {
    return this.http.put('/updateCurrency', currency).map(req => req.json());

  }

  getAllCurrencies(): Observable<any> {
    return this.http.get('/getAllCurrencies').map(req => req.json())}

  addCurrency(currency: any): Observable<any> {
    return this.http.post('/addCurrency', currency).map(req => req.json());
  }

  addGeo(geo: any): Observable<any> {
        return this.http.post('/addGeoMaster', geo).map(req => req.json());
  }

  updateGeo(geo: any): Observable<any> {
     return this.http.put('/updateGeoMaster', geo).map(req => req.json());
  }
  getAllGeo(): Observable<any> {
    return this.http.get('/getAllGeoMaster').map(req => req.json())}

    getAllGeoByType(type: any): Observable<any> {
      return this.http.get('/getGeoMasterByType/' + type).map(req => req.json())}


      deleteGeoById(geoId: any): Observable<any> {
        return this.http.get('/deleteGeoMasterById/' + geoId).map(req => req.json())}

        getGeoById(id: any): Observable<any> {
          return this.http.get('/getGeoMasterById/' + id).map(req => req.json())}
}





