import { Observable } from 'rxjs/Rx';
import {Injectable} from '@angular/core';

@Injectable()
export class ReturnEntryService {

 returnEntrylData = [
    {
      id: 1,
      employee: 'ABC',
      lot: 'ABC',
      issueNo: '12',
      issueDate: '12-12-12',
      returnDate: '01-01-12'
    },
    {
      id: 2,
      employee: 'ABC',
      lot: 'ABC',
      issueNo: '12',
      issueDate: '12-12-12',
      returnDate: '01-01-12'
    },
    {
      id: 3,
      employee: 'ABC',
      lot: 'ABC',
      issueNo: '12',
      issueDate: '12-12-12',
      returnDate: '01-01-12'
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.returnEntrylData);
      }, 1000);
    });
  }

  createReturnEntry(returnEntry: ReturnEntry): Observable<ReturnEntry> {
     return Observable.of(returnEntry);
  }
}

export interface ReturnEntry {
  employee: string;
  lot: string;
  issueNo: string;
  issueDate: string;
  returnDate: string;
}
