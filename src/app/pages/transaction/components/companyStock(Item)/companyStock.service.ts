import {Injectable} from '@angular/core';

@Injectable()
export class CompanyStockService {

  CompanyStockData = [
    {
      id: 1,
      categoryName: 'Mark',
      categoryCode: 'Otto',
      staticalCode: '@mdo',
      description: 'description'
    },
    {
      id: 2,
      categoryName: 'Jacob',
      categoryCode: 'Thornton',
      staticalCode: '@fat',
      description: 'description'
    },
    {
      id: 3,
      categoryName: 'Larry',
      categoryCode: 'Bird',
      staticalCode: '@twitter',
      description: 'description'
    },
    {
      id: 4,
      categoryName: 'John',
      categoryCode: 'Snow',
      staticalCode: '@snow',
      description: 'description'
    },
    {
      id: 5,
      categoryName: 'Jack',
      categoryCode: 'Sparrow',
      staticalCode: '@jack',
      description: 'description'
    },
    {
      id: 6,
      categoryName: 'Ann',
      categoryCode: 'Smith',
      staticalCode: '@ann',
            description: 'description'
    },
    {
      id: 7,
      categoryName: 'Barbara',
      categoryCode: 'Black',
      staticalCode: '@barbara',
      description: 'description'
    },
    {
      id: 8,
      categoryName: 'Sevan',
      categoryCode: 'Bagrat',
      staticalCode: '@sevan',
      description: 'description'
    },
    {
      id: 9,
      categoryName: 'Ruben',
      categoryCode: 'Vardan',
      staticalCode: '@ruben',
      description: 'description'
    },
    {
      id: 10,
      categoryName: 'Karen',
      categoryCode: 'Sevan',
      staticalCode: '@karen',
      description: 'description'
    },
    {
      id: 11,
      categoryName: 'Mark',
      categoryCode: 'Otto',
      staticalCode: '@mark',
      description: 'description'
    },
    {
      id: 12,
      categoryName: 'Jacob',
      categoryCode: 'Thornton',
      staticalCode: '@jacob',
      description: 'description'
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.CompanyStockData);
      }, 2000);
    });
  }
}
