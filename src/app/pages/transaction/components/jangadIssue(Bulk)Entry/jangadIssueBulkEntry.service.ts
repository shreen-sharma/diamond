import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class JangadIssueBulkEntryService {

  JangadIssueBulkEntryData = [
    {
      id: '1',
      selectParty: 'HCL',
      process: 'Otto',
      lot: 'Oppo',
      issueDate: '08/23/2017',
      jangadNo: 100,
      jangadFormat: 'ABC',
    },
    {
      id: '2',
      selectParty: 'HCL',
      process: 'Tito',
      lot: 'LeTv',
      issueDate: '07/14/2017',
      jangadNo: 100,
      jangadFormat: 'ABC',
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.JangadIssueBulkEntryData);
      }, 1000);
    });
  }

  getJangadIssueBulkEntryDataById(jangadIssueBulkEntryDataId: string): any {
    const len: number = this.JangadIssueBulkEntryData.length;

    for (let i = 0; i < len; i++) {
      if (this.JangadIssueBulkEntryData[i].id === jangadIssueBulkEntryDataId) {
        return this.JangadIssueBulkEntryData[i];
      }
    }

    return null;
  }

  createJangadIssueBulkEntry(jangadIssueBulkEntry: any): Observable<any> {
    jangadIssueBulkEntry.id = this.JangadIssueBulkEntryData.length + 1 + '';
    this.JangadIssueBulkEntryData.push(jangadIssueBulkEntry);
    return Observable.of(jangadIssueBulkEntry);
  }

  updateJangadIssueBulkEntry(jangadIssueBulkEntry: any): Observable<any> {
    const len: number = this.JangadIssueBulkEntryData.length;

    for (let i = 0; i < len; i++) {
      if (this.JangadIssueBulkEntryData[i].id === jangadIssueBulkEntry.id) {
        this.JangadIssueBulkEntryData[i] = jangadIssueBulkEntry;
        return Observable.of(jangadIssueBulkEntry);
      }
    }
    return Observable.of(jangadIssueBulkEntry);
  }
}

export interface JangadIssueBulkEntryUpdate {
  id?: string;
  selectParty: string;
  process: string;
  lot: string;
  issuedate: string;
  jangadNo: number;
  jangadFormat: string;
  expectedYield: string;
  assorter: string;
  instruction: string;
}
