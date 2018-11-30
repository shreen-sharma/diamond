import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class JangadMixingService {

  jangadMixingData = [
    {
      id: '1',
      selectPartyAccount: 'Category 2',
      jangadMixingDate: 'Supplier 2',
      selectLot: 'Lot 1'
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.jangadMixingData);
      }, 1000);
    });
  }
  getJangadMixingById(jangadMixingId: string): any {
    const len: number = this.jangadMixingData.length;

    for (let i = 0; i < len; i++) {
      if (this.jangadMixingData[i].id === jangadMixingId) {
        return this.jangadMixingData[i];
      }
    }

    return null;
  }

  createJangadMixing(jangadMixing: any): Observable<any> {
    jangadMixing.id = this.jangadMixingData.length + 1 + '';
    this.jangadMixingData.push(jangadMixing);
    return Observable.of(jangadMixing);
  }

  updateJangadMixing(jangadMixing: any): Observable<any> {
    const len: number = this.jangadMixingData.length;

    for (let i = 0; i < len; i++) {
      if (this.jangadMixingData[i].id === jangadMixing.id) {
        this.jangadMixingData[i] = jangadMixing;
        return Observable.of(jangadMixing);
      }
    }
    return Observable.of(jangadMixing);
  }
}

export interface JangadMixings {
  id?: string;
  selectCategory: string;
  selectSupplier: string;
  assignFrom: string;
  assignmentDate: string;
  selectLot: string;
  selectItem: string;
  totalCarats: number;
  avgRate: number;
  availableImportDetails: string;
}
