import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from 'app/core/http';

@Injectable()
export class ItemSummaryService {


  constructor(private http: HttpService) {
  }
  getLoggedInUserPermission(): Observable<any> {

    return this.http.get('/user/getLoggedInUserPermission').map(res => {
      return res.json();
      // 
    })
  }

  getItemsforBalancesheet(): Observable<any> {
    return this.http.get('/getItemsForBalancesheet').map(req => req.json());
  }

  getStockSummary(item): Observable<any> {
    return this.http.get('/lot/getStockSummary/' + item).map(req => req.json());
  }
  getStockTotal(): Observable<any> {
    return this.http.get('/lot/getStockTotal').map(req => req.json());
  }

  getCompletedStockTotal(): Observable<any> {
    return this.http.get('/getCompletedStockTotal').map(req => req.json());
  }

  getFinancialYearTotalPurchase(): Observable<any> {
    return this.http.get('/lot/getFinancialYearTotalPurchase').map(req => req.json());
  }

  getFinancialYearTotalSales(): Observable<any> {
    return this.http.get('/lot/getFinancialYearTotalSales').map(req => req.json());
  }
  getFinancialYearOfPayable(): Observable<any> {
    return this.http.get('/getFinancialYearOfPayable').map(req => req.json());
  }
  getFinancialYearOfReceivable(): Observable<any> {
    return this.http.get('/getFinancialYearOfReceivable').map(req => req.json());
  }
  getFinancialYearTopCustomer(): Observable<any> {
    return this.http.get('/getFinancialYearTopCustomer').map(req => req.json());
  }
  getFinancialYearTopSupplier(): Observable<any> {
    return this.http.get('/getFinancialYearTopSupplier').map(req => req.json());
  }
  getFinancialYearOfBrokerageAmount(): Observable<any> {
    return this.http.get('/getFinancialYearOfBrokerageAmount').map(req => req.json());
  }

  getFinancialYearOfNotionalProfitAmount(): Observable<any> {
    return this.http.get('/getFinancialYearOfNotionalProfitAmount').map(req => req.json());
  }

  getSalesAmountForEachMonth(): Observable<any> {
    return this.http.get('/getSalesAmountForEachMonth').map(req => req.json());
  }

  getPurchaseAmountForEachMonth(): Observable<any> {
    return this.http.get('/getPurchaseAmountForEachMonth').map(req => req.json());
  }

  getNonClosedDcConsignmentReceiptCounts(): Observable<any> {
    return this.http.get('/getNonClosedDcConsignmentReceiptCounts').map(req => req.json());
  }
  getNotCompletedPayableAndReceivable(): Observable<any> {
    return this.http.get('/getNotCompletedPayableAndReceivable').map(req => req.json());
  }

  getNotClosedOfConsignmentAndDCForDeliveryChallan(): Observable<any> {
    return this.http.get('/getNotClosedOfConsignmentAndDCForDeliveryChallan').map(req => req.json());
  }


}


