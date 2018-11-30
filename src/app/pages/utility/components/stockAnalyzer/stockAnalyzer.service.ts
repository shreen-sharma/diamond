import { Observable } from 'rxjs/Rx';
import {Injectable} from '@angular/core';

@Injectable()
export class StockAnalyzerService {

   stockAnalyzerData = [
    {
      id: '1',
      company: 'Mark',
      category: 'Otto',
      lot: '@mdo',
      item: 'abc'
    },
    {
      id: '2',
      company: 'Jacob',
      category: 'Thornton',
      lot: '@fat',
      item: 'abc'
    },
    {
      id: '3',
      company: 'Larry',
      category: 'Bird',
      lot: '@twitter',
      item: 'abc'
    },
    {
      id: '4',
      company: 'John',
      category: 'Snow',
      lot: '@snow',
      item: 'abc'
    },
    {
      id: '5',
      company: 'Jack',
      category: 'Sparrow',
      lot: '@jack',
      item: 'abc'
    },
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this. stockAnalyzerData);
      }, 2000);
    });
  }
  getStockAnalyzerById(stockAnalyzerId: string): any {
    const len: number = this.stockAnalyzerData.length;

    for (let i = 0; i < len; i++) {
      if (this.stockAnalyzerData[i].id === stockAnalyzerId) {
        return this.stockAnalyzerData[i];
      }
    }

    return null;
  }

  createStockAnalyzer(stockAnalyzer: any): Observable<any> {
    stockAnalyzer.id = this.stockAnalyzerData.length + 1 + '';
    this.stockAnalyzerData.push(stockAnalyzer);
    return Observable.of(stockAnalyzer);
  }

  updateStockAnalyzer(stockAnalyzer: any): Observable<any> {
    const len: number = this.stockAnalyzerData.length;

    for (let i = 0; i < len; i++) {
      if (this.stockAnalyzerData[i].id === stockAnalyzer.id) {
        this.stockAnalyzerData[i] = stockAnalyzer;
        return Observable.of(stockAnalyzer);
      }
    }
    return Observable.of(stockAnalyzer);
  }
}

export interface StockAnalyzers {
  id?: string;
  company: string;
  category: string;
  lot: string;
}
