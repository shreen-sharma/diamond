import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class PaymentReceiptEntryService {

  PaymentReceiptEntryData = [
     {
      id: '1',
      invoiceNo: 'HCL',
      docDate: '2017-08-11',
      docNo: 'Otto',
      bankName: 'Iob',
      bank: 'cash',
      chequeNo: '1DFG1234',
      totalAmount: 100
    },
    {
      id: '2',
      invoiceNo: 'HCL',
      docDate: '2017-08-11',
      docNo: 'Thornton',
      bankName: 'Iob',
      bank: 'cash',
      chequeNo: '1DFG1234',
      totalAmount: 10
    },
    {
      id: '3',
      invoiceNo: 'HCL',
      docDate: '2017-08-11',
      docNo: 'Bird',
      bankName: 'Iob',
      bank: 'bank',
      chequeNo: '1DFG1234',
      totalAmount: 100
    },
    {
      id: '4',
      invoiceNo: 'HCL',
      docDate: '2017-08-11',
      docNo: 'Snow',
      bankName: 'Iob',
      bank: 'cash',
      chequeNo: '1DFG1234',
      totalAmount: 50
    },
    {
      id: '5',
      invoiceNo: 'HCL',
      docDate: '2017-08-11',
      docNo: 'Sparrow',
      bankName: 'Iob',
      bank: 'bank',
      chequeNo: '1DFG1234',
      totalAmount: 100
    },
    {
      id: '6',
      invoiceNo: 'HCL',
      docDate: '2017-08-11',
      docNo: 'Smith',
      bankName: 'Iob',
      bank: 'cash',
      chequeNo: '1DFG1234',
      totalAmount: 100
    },
    {
      id: '7',
      invoiceNo: 'HCL',
      docDate: '2017-08-11',
      docNo: 'Black',
      bankName: 'Iob',
      bank: 'cash',
      chequeNo: '1DFG1234',
      totalAmount: 100
    },
    {
      id: '8',
      invoiceNo: 'HCL',
      docDate: '2017-08-11',
      docNo: 'Bagrat',
      bankName: 'Iob',
      bank: 'cash',
      chequeNo: '1DFG1234',
      totalAmount: 100
    },
    {
      id: '9',
      invoiceNo: 'HCL',
      docDate: '2017-08-11',
      docNo: 'Vardan',
      bankName: 'Iob',
      bank: 'cash',
      chequeNo: '1DFG1234',
      totalAmount: 100
    },
    {
      id: '10',
      invoiceNo: 'HCL',
      docDate: '2017-08-11',
      docNo: 'Sevan',
      bankName: 'Iob',
      bank: 'cash',
      chequeNo: '1DFG1234',
      totalAmount: 100
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.PaymentReceiptEntryData);
      }, 1000);
    });
  }

  getPaymentReceiptEntryById(paymentReceiptEntryId: string): any {
    const len: number = this.PaymentReceiptEntryData.length;

    for (let i = 0; i < len; i++) {
      if (this.PaymentReceiptEntryData[i].id === paymentReceiptEntryId) {
        return this.PaymentReceiptEntryData[i];
      }
    }

    return null;
  }

  createPaymentReceiptEntry(paymentReceiptEntry: any): Observable<any> {
    paymentReceiptEntry.id = this.PaymentReceiptEntryData.length + 1 + '';
    this.PaymentReceiptEntryData.push(paymentReceiptEntry);
    return Observable.of(paymentReceiptEntry);
  }

  updatePaymentReceiptEntry(paymentReceiptEntry: any): Observable<any> {
    const len: number = this.PaymentReceiptEntryData.length;

    for (let i = 0; i < len; i++) {
      if (this.PaymentReceiptEntryData[i].id === paymentReceiptEntry.id) {
        this.PaymentReceiptEntryData[i] = paymentReceiptEntry;
        return Observable.of(paymentReceiptEntry);
      }
    }
    return Observable.of(paymentReceiptEntry);
  }
}

export interface PaymentReceipt {
  id?: string;
  invoiceNo: string;
  docNo: string;
  docDate: string;
  bank: string;
  bankName: string;
  chequeNo: string;
  totalAmount: number;
}
