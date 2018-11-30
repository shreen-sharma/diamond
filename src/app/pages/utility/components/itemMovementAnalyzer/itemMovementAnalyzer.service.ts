import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';

@Injectable()
export class ItemMovementAnalyzerService {

  itemMovementAnalyzerData = [
    {
      id: '1',
      company: 'Mark',
      category: 'Otto',
      party: 'p1',
      lot: '@mdo',
      item: 'aaa',
    },
    {
      id: '2',
      company: 'Jacob',
      category: 'Thornton',
      party: 'p12',
      lot: '@mdo',
      item: 'aasdfa',
    },
    {
      id: '3',
      company: 'Larry',
      category: 'Bird',
      party: 'p13',
      lot: '@msfddo',
      item: 'aadsfda',
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.itemMovementAnalyzerData);
      }, 2000);
    });
  }
   getItemMovementAnalyzerById(itemMovementAnalyzerId: string): any {
    const len: number = this.itemMovementAnalyzerData.length;

    for (let i = 0; i < len; i++) {
      if (this.itemMovementAnalyzerData[i].id === itemMovementAnalyzerId) {
        return this.itemMovementAnalyzerData[i];
      }
    }

    return null;
  }

  createItemMovementAnalyzer(itemMovementAnalyzer: any): Observable<any> {
    itemMovementAnalyzer.id = this.itemMovementAnalyzerData.length + 1 + '';
    this.itemMovementAnalyzerData.push(itemMovementAnalyzer);
    return Observable.of(itemMovementAnalyzer);
  }

  updateItemMovementAnalyzer(itemMovementAnalyzer: any): Observable<any> {
    const len: number = this.itemMovementAnalyzerData.length;

    for (let i = 0; i < len; i++) {
      if (this.itemMovementAnalyzerData[i].id === itemMovementAnalyzer.id) {
        this.itemMovementAnalyzerData[i] = itemMovementAnalyzer;
        return Observable.of(itemMovementAnalyzer);
      }
    }
    return Observable.of(itemMovementAnalyzer);
  }
}

export interface ItemMovementAnalyzers {
  id?: string;
  company: string;
  category: string;
  searchType: string;
  transactionType: string;
  partyType: string;
  fromDate: string;
  toDate: string;
  lot: string;
  item: string;
  remark: string;
}
