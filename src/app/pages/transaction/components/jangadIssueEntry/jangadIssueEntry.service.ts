import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class JangadIssueEntryService {

    JangadIssueEntryData = [
     {
       id: '1',
      selectParty: 'HCL',
      process: 'Otto',
      lot: 'Oppo',
      jangadNo: 100,
      issueDate: '08/23/2017'

     },
    {
      id: '2',
      selectParty: 'HCL',
      process: 'Tito',
      lot: 'LeTv',
      jangadNo: 100,
      issueDate: '07/14/2017'
    }
    // {
    //   id: '3',
    //   selectParty: 'HCL',
    //   process: 'Otto',
    //   inwardNo: 100,
    //   lot: 'Otto',
    //   jangadNo: 100
    // },
    // {
    //   id: '4',
    //   selectParty: 'HCL',
    //   process: 'Otto',
    //   inwardNo: 100,
    //   lot: 'Otto',
    //   jangadNo: 100
    // },
    // {
    //   id: '5',
    //   selectParty: 'HCL',
    //   process: 'Otto',
    //   inwardNo: 100,
    //   lot: 'Otto',
    //   jangadNo: 100
    // },
    // {
    //   id: '6',
    //   selectParty: 'HCL',
    //   process: 'Otto',
    //   inwardNo: 100,
    //   lot: 'Otto',
    //   jangadNo: 100
    // },
    // {
    //   id: '7',
    //   selectParty: 'HCL',
    //   process: 'Otto',
    //   inwardNo: 100,
    //   lot: 'Otto',
    //   jangadNo: 100
    // },
    // {
    //   id: '8',
    //   selectParty: 'HCL',
    //   process: 'Otto',
    //   inwardNo: 100,
    //   lot: 'Otto',
    //   jangadNo: 100
    // },
    // {
    //   id: '9',
    //   selectParty: 'HCL',
    //   process: 'Otto',
    //   inwardNo: 100,
    //   lot: 'Otto',
    //   jangadNo: 100
    // },
    // {
    //   id: '10',
    //   selectParty: 'HCL',
    //   process: 'Otto',
    //   inwardNo: 100,
    //   lot: 'Otto',
    //   jangadNo: 100
    // }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.JangadIssueEntryData);
      }, 1000);
    });
  }

  getJangadIssueEntryDataById(jangadIssueEntryDataId: string): any {
    const len: number = this.JangadIssueEntryData.length;

    for (let i = 0; i < len; i++) {
      if (this.JangadIssueEntryData[i].id === jangadIssueEntryDataId) {
        return this.JangadIssueEntryData[i];
      }
    }

    return null;
  }

  createJangadIssueEntry(jangadIssueEntry: any): Observable<any> {
    jangadIssueEntry.id = this.JangadIssueEntryData.length + 1 + '';
    this.JangadIssueEntryData.push(jangadIssueEntry);
    return Observable.of(jangadIssueEntry);
  }

  updateJangadIssueEntry(jangadIssueEntry: any): Observable<any> {
    const len: number = this.JangadIssueEntryData.length;

    for (let i = 0; i < len; i++) {
      if (this.JangadIssueEntryData[i].id === jangadIssueEntry.id) {
        this.JangadIssueEntryData[i] = jangadIssueEntry;
        return Observable.of(jangadIssueEntry);
      }
    }
    return Observable.of(jangadIssueEntry);
  }
}

export interface JangadIssueEntryUpdate {
  id?: string;
  selectParty: string;
  process: string;
  jangadNo: number;
  lot: string;
}
