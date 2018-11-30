import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';

@Injectable()
export class ItemRateAnalyzerService {

  itemRateAnalyzerData = [
    {
      id: '1',
      company: 'Mark',
      partyType: 'Otto',
      party: 'p1',
      category: '@mdo',
      item: 'aaa',
    },
   ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.itemRateAnalyzerData);
      }, 2000);
    });
  }
   getItemRateAnalyzerById(itemRateAnalyzerId: string): any {
    const len: number = this.itemRateAnalyzerData.length;

    for (let i = 0; i < len; i++) {
      if (this.itemRateAnalyzerData[i].id === itemRateAnalyzerId) {
        return this.itemRateAnalyzerData[i];
      }
    }

    return null;
  }

  createItemRateAnalyzer(itemRateAnalyzer: any): Observable<any> {
    itemRateAnalyzer.id = this.itemRateAnalyzerData.length + 1 + '';
    this.itemRateAnalyzerData.push(itemRateAnalyzer);
    return Observable.of(itemRateAnalyzer);
  }

  updateItemRateAnalyzer(itemRateAnalyzer: any): Observable<any> {
    const len: number = this.itemRateAnalyzerData.length;

    for (let i = 0; i < len; i++) {
      if (this.itemRateAnalyzerData[i].id === itemRateAnalyzer.id) {
        this.itemRateAnalyzerData[i] = itemRateAnalyzer;
        return Observable.of(itemRateAnalyzer);
      }
    }
    return Observable.of(itemRateAnalyzer);
  }
}

export interface ItemRateAnalyzers {
  id?: string;
  company: string;
  partyType: string;
  party: string;
  searchMode: string;
  zone: string;
  country: string;
  currency: string;
  curFromdate: string;
  curTodate: string;
  terms: string;
  termsFromdate: string;
  termsToDate: string;
  category: string;
  item: string;
  itemDesc: string;
}
