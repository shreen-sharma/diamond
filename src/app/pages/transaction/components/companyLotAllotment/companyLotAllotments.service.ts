import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class CompanyLotAllotmentsService {

  companyLotAllotmentData = [
    {
      id: '1',
      selectedCompany: 'HCL',
      lotAllotmentDate: '2017-08-11',
      availableLot: 'Otto'
    },
    {
      id: '2',
      selectedCompany: 'HCL',
      lotAllotmentDate: '2017-08-11',
      availableLot: 'Thornton'
    },
    {
      id: '3',
      selectedCompany: 'HCL',
      lotAllotmentDate: '2017-08-11',
      availableLot: 'Bird'
    },
    {
      id: '4',
      selectedCompany: 'HCL',
      lotAllotmentDate: '2017-08-11',
      availableLot: 'Snow'
    },
    {
      id: '5',
      selectedCompany: 'HCL',
      lotAllotmentDate: '2017-08-11',
      availableLot: 'Sparrow'
    },
    {
      id: '6',
      selectedCompany: 'HCL',
      lotAllotmentDate: '2017-08-11',
      availableLot: 'Smith'
    },
    {
      id: '7',
      selectedCompany: 'HCL',
      lotAllotmentDate: '2017-08-11',
      availableLot: 'Black'
    },
    {
      id: '8',
      selectedCompany: 'HCL',
      lotAllotmentDate: '2017-08-11',
      availableLot: 'Bagrat'
    },
    {
      id: '9',
      selectedCompany: 'HCL',
      lotAllotmentDate: '2017-08-11',
      availableLot: 'Vardan'
    },
    {
      id: '10',
      selectedCompany: 'HCL',
      lotAllotmentDate: '2017-08-11',
      availableLot: 'Sevan'
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.companyLotAllotmentData);
      }, 1000);
    });
  }

  getCompanyLotAllotmentById(companyLotAllotmentId: string): any {
    const len: number = this.companyLotAllotmentData.length;

    for (let i = 0; i < len; i++) {
      if (this.companyLotAllotmentData[i].id === companyLotAllotmentId) {
        return this.companyLotAllotmentData[i];
      }
    }

    return null;
  }

  createCompanyLotAllotment(companyLotAllotment: any): Observable<any> {
    companyLotAllotment.id = this.companyLotAllotmentData.length + 1 + '';
    this.companyLotAllotmentData.push(companyLotAllotment);
    return Observable.of(companyLotAllotment);
  }

  updateCompanyLotAllotment(companyLotAllotment: any): Observable<any> {
    const len: number = this.companyLotAllotmentData.length;

    for (let i = 0; i < len; i++) {
      if (this.companyLotAllotmentData[i].id === companyLotAllotment.id) {
        this.companyLotAllotmentData[i] = companyLotAllotment;
        return Observable.of(companyLotAllotment);
      }
    }
    return Observable.of(companyLotAllotment);
  }
}

export interface CompanyLotAllot {
  id?: string;
  selectedCompany: string;
  availableLot: string;
  lotAllotmentDate: string;
}
