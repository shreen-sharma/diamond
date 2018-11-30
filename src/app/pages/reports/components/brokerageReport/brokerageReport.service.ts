import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class BrokerageReportService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
    this.authenticationService = authService;
  }

  getKDagainstPI(suppId: any, fromDate: any, toDate: any, invoiceType: any): Observable<any> {
    return this.http.get('/getKDagainstPI/' + suppId + '/' + fromDate + '/' + toDate + '/' + invoiceType).map(req => req.json());
  }

  getAllPhysicalStockAdjust(): Observable<any> {
    return this.http.get('/getAllPhysicalStockAdjust').map(req => req.json());
  }

  getGroupOfBrokerageByCustomerOnSales(partyId: any): Observable<any> {
    return this.http.get('/getGroupOfBrokerageByCustomerOnSales/' + partyId).map(req => req.json())
  }

  getAllBrokerageBySales(brokerId: any): Observable<any> {
    return this.http.get('/getAllBrokerageBySales/' + brokerId).map(req => req.json())
  }

  getIssuedReturnReports(partyId: any, fromDate: any, toDate: any, consignmentStatus: any): Observable<any> {
    return this.http.get('/getIssuedReturnReports/' + partyId + '/' + fromDate + '/' + toDate + '/' + consignmentStatus).map(req => req.json())
  }
  getGroupOfBrokerageBySupplierOnPurchase(partyId: any): Observable<any> {
    return this.http.get('/getGroupOfBrokerageBySupplierOnPurchase/' + partyId).map(req => req.json())
  }

  getAllBrokerageByPurchase(brokerId: any): Observable<any> {
    return this.http.get('/getAllBrokerageByPurchase/' + brokerId).map(req => req.json())
  }


  getNonPaidSalesDetailsTillToday(paymentStatus: any): Observable<any> {
    return this.http.get('/getNonPaidSalesDetailsTillToday/' + paymentStatus).map(req => req.json())
  }

  getNonPaidPurchaseDetailsTillToday(paymentStatus: any): Observable<any> {
    return this.http.get('/getNonPaidPurchaseDetailsTillToday/' + paymentStatus).map(req => req.json())
  }



}

