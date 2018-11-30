import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class LocPurchaseAssignmentService {

  locPurchaseAssignmentData = [
    {
      id: '1',
      selectCategory: 'Category 2',
      selectSupplier: 'Supplier 2',
      assignFrom: 'Assign 2',
      assignmentDate: '2017-08-11',
      selectLot: 'Lot 2',
      selectItem: 'Item 2',
      totalCarats: 5,
      avgRate: 2
    },
    {
      id: '2',
      selectCategory: 'Category 2',
      selectSupplier: 'Supplier 2',
      assignFrom: 'Assign 2',
      assignmentDate: '2017-08-11',
      selectLot: 'Lot 2',
      selectItem: 'Item 2',
      totalCarats: 5,
      avgRate: 2
    },
    {
      id: '3',
      selectCategory: 'Category 2',
      selectSupplier: 'Supplier 2',
      assignFrom: 'Assign 2',
      assignmentDate: '2017-08-11',
      selectLot: 'Lot 2',
      selectItem: 'Item 2',
      totalCarats: 5,
      avgRate: 2
    },
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.locPurchaseAssignmentData);
      }, 1000);
    });
  }
  getLocPurchaseAssignmentById(locPurchaseAssignmentId: string): any {
    const len: number = this.locPurchaseAssignmentData.length;

    for (let i = 0; i < len; i++) {
      if (this.locPurchaseAssignmentData[i].id === locPurchaseAssignmentId) {
        return this.locPurchaseAssignmentData[i];
      }
    }

    return null;
  }

  createLocPurchaseAssignment(locPurchaseAssignment: any): Observable<any> {
    locPurchaseAssignment.id = this.locPurchaseAssignmentData.length + 1 + '';
    this.locPurchaseAssignmentData.push(locPurchaseAssignment);
    return Observable.of(locPurchaseAssignment);
  }

  updateLocPurchaseAssignment(locPurchaseAssignment: any): Observable<any> {
    const len: number = this.locPurchaseAssignmentData.length;

    for (let i = 0; i < len; i++) {
      if (this.locPurchaseAssignmentData[i].id === locPurchaseAssignment.id) {
        this.locPurchaseAssignmentData[i] = locPurchaseAssignment;
        return Observable.of(locPurchaseAssignment);
      }
    }
    return Observable.of(locPurchaseAssignment);
  }
}

export interface LocPurchaseAssign {
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
