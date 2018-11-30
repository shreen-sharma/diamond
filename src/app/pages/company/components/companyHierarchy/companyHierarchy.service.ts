import {Injectable} from '@angular/core';

@Injectable()
export class CompanyHierarchyService {

  companyHierarchyData = [
    {
      id: 1,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 2,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 3,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 4,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 5,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 6,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 7,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 8,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 9,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 10,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 11,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 12,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 13,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 14,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    },
    {
      id: 15,
      loggedCompanyName: 'HCL',
      division: 'North',
      location: 'Noida',
      department: 'Hr',
      sub_department: 'ECB'
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.companyHierarchyData);
      }, 2000);
    });
  }
}
