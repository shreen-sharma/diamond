import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class StockSummaryService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
    this.authenticationService = authService;
  }

  getAllStockSummary(): Observable<any> {
    return this.http.get('/MIS/getStockSummary').map(req => req.json())
  }

  getAllLotItemReportByLotItemLotId(lotID: number): Observable<any> {
    return this.http.get('/lot/getAllLotItemReportByLotItemLotId' + '/' + lotID).map(req => req.json())
  }

  getStockSummaryReportByStockType(stockType: any, lotID: any, itemID: any): Observable<any> {
    return this.http.get('/getStockSummaryReportByStockType' + '/' + stockType + '/' + lotID + '/' + itemID).map(req => req.json())
  }
  getSummaryLotReportByStockType(stockType:any): Observable<any> {
    return this.http.get('/getSummaryLotReportByStockType' + '/' + stockType).map(req => req.json())
  }
}