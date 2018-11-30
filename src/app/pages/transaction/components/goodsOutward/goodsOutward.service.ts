import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class GoodsOutwardService {

  GoodsOutwardData = [
     {
      id: '1',
      selectParty: 'HCL',
      outwardNo: 100,
      processedCts: 12,
      unprocessedCts: 10,
      processLoss: 100,
      totalReturnCts: 100
    },
    {
      id: '2',
      selectParty: 'HCL',
      outwardNo: 100,
      processedCts: 12,
      unprocessedCts: 10,
      processLoss: 100,
      totalReturnCts: 100
    },
    {
      id: '3',
      selectParty: 'HCL',
      outwardNo: 100,
      processedCts: 12,
      unprocessedCts: 10,
      processLoss: 100,
      totalReturnCts: 100
    },
    {
      id: '4',
      selectParty: 'HCL',
      outwardNo: 100,
      processedCts: 12,
      unprocessedCts: 10,
      processLoss: 100,
      totalReturnCts: 100
    },
    {
      id: '5',
      selectParty: 'HCL',
      outwardNo: 100,
      processedCts: 12,
      unprocessedCts: 10,
      processLoss: 100,
      totalReturnCts: 100
    },
    {
      id: '6',
      selectParty: 'HCL',
      outwardNo: 100,
      processedCts: 12,
      unprocessedCts: 10,
      processLoss: 100,
      totalReturnCts: 100
    },
    {
      id: '7',
      selectParty: 'HCL',
      outwardNo: 100,
      processedCts: 12,
      unprocessedCts: 10,
      processLoss: 100,
      totalReturnCts: 100
    },
    {
      id: '8',
      selectParty: 'HCL',
      outwardNo: 100,
      processedCts: 12,
      unprocessedCts: 10,
      processLoss: 100,
      totalReturnCts: 100
    },
    {
      id: '9',
      selectParty: 'HCL',
      outwardNo: 100,
      processedCts: 12,
      unprocessedCts: 10,
      processLoss: 100,
      totalReturnCts: 100
    },
    {
      id: '10',
      selectParty: 'HCL',
      outwardNo: 100,
      processedCts: 12,
      unprocessedCts: 10,
      processLoss: 100,
      totalReturnCts: 100
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.GoodsOutwardData);
      }, 1000);
    });
  }

  getGoodsOutwardById(goodsOutwardId: string): any {
    const len: number = this.GoodsOutwardData.length;

    for (let i = 0; i < len; i++) {
      if (this.GoodsOutwardData[i].id === goodsOutwardId) {
        return this.GoodsOutwardData[i];
      }
    }

    return null;
  }

  createGoodsOutward(goodsOutward: any): Observable<any> {
    goodsOutward.id = this.GoodsOutwardData.length + 1 + '';
    this.GoodsOutwardData.push(goodsOutward);
    return Observable.of(goodsOutward);
  }

  updateGoodsOutward(goodsOutward: any): Observable<any> {
    const len: number = this.GoodsOutwardData.length;

    for (let i = 0; i < len; i++) {
      if (this.GoodsOutwardData[i].id === goodsOutward.id) {
        this.GoodsOutwardData[i] = goodsOutward;
        return Observable.of(goodsOutward);
      }
    }
    return Observable.of(goodsOutward);
  }
}

export interface GoodsOutwardForManufacturing {
  id?: string;
  selectParty: string;
  outwardNo: number;
  processedCts: number;
  processLoss: number;
  unprocessedCts: number;
  totalReturnCts: number;
}
