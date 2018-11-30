import { HttpService } from './../../../../core/http/http.service';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class BrokerPaymentEntryService {

  constructor(private http: HttpService) { }

  getLocalPurchaseInvoiceBrokersByBrokerPayment(brokerPayment: string): Observable<any> {
    return this.http.get('/getLocalPurchaseInvoiceBrokersByBrokerPayment/' + brokerPayment).map(req => req.json());
  }

  getImportPurchaseInvoiceBrokersByBrokerPayment(brokerPayment: string): Observable<any> {
    return this.http.get('/getImportPurchaseInvoiceBrokersByBrokerPayment/' + brokerPayment).map(req => req.json());
  }

  getLocalSalesInvoiceBrokersByBrokerPayment(brokerPayment: string): Observable<any> {
    return this.http.get('/getLocalSalesInvoiceBrokersByBrokerPayment/' + brokerPayment).map(req => req.json());
  }

  getExportSalesInvoiceBrokersByBrokerPayment(brokerPayment: string): Observable<any> {
    return this.http.get('/getExportSalesInvoiceBrokersByBrokerPayment/' + brokerPayment).map(req => req.json());
  }

  getLocalPurchaseInvoiceByBrokerIdAndBrokerPayment(completed: string, brokerId: number, brokerPayment: string): Observable<any> {
    return this.http.get('/getLocalPurchaseInvoiceByBrokerIdAndBrokerPayment/' + completed + '/' +
      brokerId + '/' + brokerPayment).map(req => req.json());
  }

  getImportPurchaseInvoiceByBrokerIdAndBrokerPayment(completed: string, brokerId: number, brokerPayment: string): Observable<any> {
    return this.http.get('/getImportPurchaseInvoiceByBrokerIdAndBrokerPayment/' + completed + '/' +
      brokerId + '/' + brokerPayment).map(req => req.json());
  }

  getLocalSalesInvoiceByBrokerIdAndBrokerPayment(completed: string, brokerId: number, brokerPayment: string): Observable<any> {
    return this.http.get('/getLocalSalesInvoiceByBrokerIdAndBrokerPayment/' + completed + '/' +
      brokerId + '/' + brokerPayment).map(req => req.json());
  }

  getExportSalesInvoiceByBrokerIdAndBrokerPayment(completed: string, brokerId: number, brokerPayment: string): Observable<any> {
    return this.http.get('/getExportSalesInvoiceByBrokerIdAndBrokerPayment/' + completed + '/' +
      brokerId + '/' + brokerPayment).map(req => req.json());
  }

  getAllPartiesByType(partyType: string): Observable<any> {
    return this.http.get('/getAllPartiesByType/' + partyType).map(req => req.json());
  }

  getAllBrokerPayment(): Observable<any> {
    return this.http.get('/getAllBrokerPayment').map(req => req.json());
  }

  addBrokerPayment(data: any): Observable<any> {
    return this.http.post('/addBrokerPayment', data).map(req => req.json());
  }

  getBrokerPaymentById(paymentId: any): Observable<any> {
    return this.http.get('/getBrokerPaymentById/' + paymentId).map(req => req.json());
  }

  getBrokerPaymentDetailsByInvoiceIdAndType(invoiceId: number, invoiceType: string): Observable<any[]> {
    return this.http.get('/getBrokerPaymentDetailsByInvoiceIdAndType/' + invoiceId + '/' + invoiceType.toUpperCase())
      .map(req => req.json());
  }

}
