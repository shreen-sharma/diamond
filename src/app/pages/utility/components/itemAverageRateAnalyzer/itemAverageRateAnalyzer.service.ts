import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class ItemAverageRateAnalyzerService {

  itemAverageRateAnalyzerData = [
    {
      id: '1',
      company: 'Mark',
      category: 'Otto',
      lot: '@mdo',
      columnParameter: 'aaa',
      rowParameter: '111'
    },
    {
      id: '2',
      company: 'Jacob',
      category: 'Thornton',
      lot: '@fat',
      columnParameter: 'cccc',
      rowParameter: '88888'
    },
    {
      id: '3',
      company: 'Larry',
      category: 'Bird',
      lot: '@twitter',
      columnParameter: 'bbbb',
      rowParameter: '2222'
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.itemAverageRateAnalyzerData);
      }, 2000);
    });
  }
  getItemAverageRateAnalyzerById(itemAverageRateAnalyzerId: string): any {
    const len: number = this.itemAverageRateAnalyzerData.length;

    for (let i = 0; i < len; i++) {
      if (this.itemAverageRateAnalyzerData[i].id === itemAverageRateAnalyzerId) {
        return this.itemAverageRateAnalyzerData[i];
      }
    }

    return null;
  }

  createItemAverageRateAnalyzer(itemAverageRateAnalyzer: any): Observable<any> {
    itemAverageRateAnalyzer.id = this.itemAverageRateAnalyzerData.length + 1 + '';
    this.itemAverageRateAnalyzerData.push(itemAverageRateAnalyzer);
    return Observable.of(itemAverageRateAnalyzer);
  }

  updateItemAverageRateAnalyzer(itemAverageRateAnalyzer: any): Observable<any> {
    const len: number = this.itemAverageRateAnalyzerData.length;

    for (let i = 0; i < len; i++) {
      if (this.itemAverageRateAnalyzerData[i].id === itemAverageRateAnalyzer.id) {
        this.itemAverageRateAnalyzerData[i] = itemAverageRateAnalyzer;
        return Observable.of(itemAverageRateAnalyzer);
      }
    }
    return Observable.of(itemAverageRateAnalyzer);
  }
}
export interface ItemAverageRateAnalyzers {
  id?: string;
  company: string;
  category: string;
  lot: string;
  columnParameter: string;
  rowParameter: string;
}
