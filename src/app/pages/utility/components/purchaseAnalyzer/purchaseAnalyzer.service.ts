import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class PurchaseAnalyzerService {

  purchaseAnalyzerData = [
    {
      id: '1',
      company: 'Mark',
      category: 'Otto',
      lot: '@mdo'
    },
    {
      id: '2',
      company: 'Jacob',
      category: 'Thornton',
      lot: '@fat'
    },
    {
      id: '3',
      company: 'Larry',
      category: 'Bird',
      lot: '@twitter'
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.purchaseAnalyzerData);
      }, 2000);
    });
  }

getPurchaseAnalyzerById(purchaseAnalyzerId: string): any {
    const len: number = this.purchaseAnalyzerData.length;

    for (let i = 0; i < len; i++) {
      if (this.purchaseAnalyzerData[i].id === purchaseAnalyzerId) {
        return this.purchaseAnalyzerData[i];
      }
    }

    return null;
  }

  createPurchaseAnalyzer(purchaseAnalyzer: any): Observable<any> {
    purchaseAnalyzer.id = this.purchaseAnalyzerData.length + 1 + '';
    this.purchaseAnalyzerData.push(purchaseAnalyzer);
    return Observable.of(purchaseAnalyzer);
  }

  updatePurchaseAnalyzer(purchaseAnalyzer: any): Observable<any> {
    const len: number = this.purchaseAnalyzerData.length;

    for (let i = 0; i < len; i++) {
      if (this.purchaseAnalyzerData[i].id === purchaseAnalyzer.id) {
        this.purchaseAnalyzerData[i] = purchaseAnalyzer;
        return Observable.of(purchaseAnalyzer);
      }
    }
    return Observable.of(purchaseAnalyzer);
  }
}
export interface PurchaseAnalyzers {
  id?: string;
  company: string;
  searchMode: string;
  category: string;
  dateOptio: string;
  fromDate: string;
  toDate: string;
  partyType: string;
  party: string;
  mode: string;
  bank: string;
  terms: string;
  zode: string;
  country: string;
  vessel: string;
  paymentMode: string;
  currency: string;

}
