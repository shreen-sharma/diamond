import { Injectable } from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PurchaseOrderService {

  perchOrderData: any;
  constructor(private http: HttpService) { }

  getPurchaseOrderData(): Observable<any> {
    return this.http.get('/getAllLocalPurchaseOrderDetails').map(req => req.json())
  }

  createPurchaseOrder(partyData: any): Observable<any> {
    return this.http.post('/addLocalPurchaseOrderDetail', partyData).map(req => req.json());
  }

  updatePurchaseOrder(partyData: any): Observable<any> {
    return this.http.put('/updateLocalPurchaseOrderDetail', partyData).map(req => req.json());
  }

  getPurchaseOrderById(poId: any): Observable<any> {
    return this.http.get('/getLocalPurchaseOrderDetailById/' + poId).map(req => req.json());
  }

  deletePurchaseOrder(poId: number): Observable<any> {
    return this.http.delete('/deleteLocalPurchaseOrderDetailByID/' + poId); //.map(req => req.json());
  }

  getAllLotItems(): Observable<any[]> {
    return this.http.get('/lot/getAllLotItem').map(req => req.json());
  }

  getOpeningStockStatus(): Observable<any> {
    return this.http.get('/isOpenStockEntryComplete').map(req => req.json());
  }

  getNextPurchaseOrderNo(): Observable<any> {
    return this.http.get('/getNextPurchaseOrderNo').map(req => req.json());
  }

  getExchangeRate(type: string, currencyId: number): Observable<any> {
    return this.http.get('/getExchangeRate/' + type + '/' + currencyId).map(req => req.json());
  }

  getAllLocalPurchaseOrderStockItemsReportLotwise(poId: number): Observable<any> {
    return this.http.get('/getAllLocalPurchaseOrderStockItemsReportLotwise/' + poId).map(req => req.json());
  }

  getLatestLocPurchaseInvoicesOfSuppliers(poId: number): Observable<any> {
    return this.http.get('/getLatestLocPurchaseOrdersOfSupplier/' + poId).map(req => req.json());
  }

  localPurchaseOrderEstimateSizeReport(poId: number): Observable<any> {
    return this.http.get('/localPurchaseOrderEstimateSizeReport/' + poId).map(req => req.json());
  }

  localPurchaseOrderEstimateDistinctSizeReport(poId: number): Observable<any> {
    return this.http.get('/localPurchaseOrderEstimateDistinctSizeReport/' + poId).map(req => req.json());
  }

}
export interface PurchaseOrders {
  poNo: string;
  poDate: string;
  category: string;
  partyMasterByPartyId: string;
  itemMaster: string;
  itemDesc: string;
  pcs: string;
  pcs1: string;
  pcsCts: string;
  carets: string;
  rate: string;
  amount: string;
  pklistStatus: string;
}
