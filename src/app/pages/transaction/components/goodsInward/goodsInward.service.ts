import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class GoodsInwardService {

  GoodsInwardData = [
     {
      id: '1',
      selectParty: 'HCL',
      process: 'Otto',
      inwardNo: 100,
      lot: 'Otto',
      jangadNo: 100
    },
    {
      id: '2',
      selectParty: 'HCL',
      inwardNo: 100,
      process: 'Thornton',
      jangadNo: 10,
      lot: 'Otto'
    },
    {
      id: '3',
      selectParty: 'HCL',
      process: 'Otto',
      inwardNo: 100,
      lot: 'Otto',
      jangadNo: 100
    },
    {
      id: '4',
      selectParty: 'HCL',
      process: 'Otto',
      inwardNo: 100,
      lot: 'Otto',
      jangadNo: 100
    },
    {
      id: '5',
      selectParty: 'HCL',
      process: 'Otto',
      inwardNo: 100,
      lot: 'Otto',
      jangadNo: 100
    },
    {
      id: '6',
      selectParty: 'HCL',
      process: 'Otto',
      inwardNo: 100,
      lot: 'Otto',
      jangadNo: 100
    },
    {
      id: '7',
      selectParty: 'HCL',
      process: 'Otto',
      inwardNo: 100,
      lot: 'Otto',
      jangadNo: 100
    },
    {
      id: '8',
      selectParty: 'HCL',
      process: 'Otto',
      inwardNo: 100,
      lot: 'Otto',
      jangadNo: 100
    },
    {
      id: '9',
      selectParty: 'HCL',
      process: 'Otto',
      inwardNo: 100,
      lot: 'Otto',
      jangadNo: 100
    },
    {
      id: '10',
      selectParty: 'HCL',
      process: 'Otto',
      inwardNo: 100,
      lot: 'Otto',
      jangadNo: 100
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.GoodsInwardData);
      }, 1000);
    });
  }

  getGoodsInwardById(goodsInwardId: string): any {
    const len: number = this.GoodsInwardData.length;

    for (let i = 0; i < len; i++) {
      if (this.GoodsInwardData[i].id === goodsInwardId) {
        return this.GoodsInwardData[i];
      }
    }

    return null;
  }

  createGoodsInward(goodsInward: any): Observable<any> {
    goodsInward.id = this.GoodsInwardData.length + 1 + '';
    this.GoodsInwardData.push(goodsInward);
    return Observable.of(goodsInward);
  }

  updateGoodsInward(goodsInward: any): Observable<any> {
    const len: number = this.GoodsInwardData.length;

    for (let i = 0; i < len; i++) {
      if (this.GoodsInwardData[i].id === goodsInward.id) {
        this.GoodsInwardData[i] = goodsInward;
        return Observable.of(goodsInward);
      }
    }
    return Observable.of(goodsInward);
  }
}

export interface GoodsInwardForManufacturing {
  id?: string;
  selectParty: string;
  process: string;
  jangadNo: number;
  inwardNo: number;
  lot: string;
}
