import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class MisService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
    this.authenticationService = authService;
  }
  getAllMis(): Observable<any> {
    return this.http.get('/MIS/getAllItemsByQualityAndSize').map(req => req.json())
  }

  getLotMISReportByLotId(lotId: number, type: number, color: string): Observable<any> {
    return this.http.get('/MIS/getMISSizeReportByLotId/' + lotId + '/' + type + '/' + color).map(req => req.json());
  }


  getStockChartSizeReport(lotId: number, type: number, color: string): Observable<any> {
    return this.http.get('/MIS/getMISQualityReportByLotId/' + lotId + '/' + type + '/' + color).map(req => req.json());
  }



  getUniqueQualityOrSizeMISReportByLotId(lotId: number, type: string): Observable<any> {
    return this.http.get('/MIS/getUniqueQualityOrSizeMISReportByLotId/' + lotId + '/' + type).map(req => req.json());
  }

  getLotMISReportOfSizeOrQualityByLotId(lotId: number, type: string): Observable<any> {
    return this.http.get('/MIS/getLotMISReportOfSizeOrQualityByLotId/' + lotId + '/' + type).map(req => req.json());
  }


  getColorQualityForLot75(): Observable<any> {
    return this.http.get('/MIS/getColorQualityForLot75').map(req => req.json());
  }

}

export interface MisUpdate {
  category: string;
  lotMasterByFromLotId: string;
}
