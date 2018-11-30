import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { HttpService } from '../../../../core/http';
import { RequestOptions, Headers } from '@angular/http';

@Injectable()
export class UserService {

  usersData = [
    /*{
      id: '1',
      userName: 'Mark',
      firstName: 'Otto',
      mobileNumber: '00000',
      email: '@mdo'
    },
    {
      id: '2',
      userName: 'Jacob',
      firstName: 'Thornton',
      mobileNumber: '00000',
      email: '@fat'
    },
    {
      id: '3',
      userName: 'Larry',
      firstName: 'Bird',
      mobileNumber: '00000',
      email: '@twitter'
    },
    {
      id: '4',
      userName: 'John',
      firstName: 'Snow',
      mobileNumber: '00000',
      email: '@snow'
    },
    {
      id: '5',
      userName: 'Jack',
      firstName: 'Sparrow',
      mobileNumber: '00000',
      email: '@jack'
    },
    {
      id: '6',
      userName: 'Ann',
      firstName: 'Smith',
      mobileNumber: '00000',
            email: '@ann'
    },
    {
      id: '7',
      userName: 'Barbara',
      firstName: 'Black',
      mobileNumber: '00000',
      email: '@barbara'
    },
    {
      id: '8',
      userName: 'Sevan',
      firstName: 'Bagrat',
      mobileNumber: '00000',
      email: '@sevan'
    },
    {
      id: '9',
      userName: 'Ruben',
      firstName: 'Vardan',
      mobileNumber: '00000',
      email: '@ruben'
    },
    {
      id: '10',
      userName: 'Karen',
      firstName: 'Sevan',
      mobileNumber: '00000',
      email: '@karen'
    },
    {
      id: '11',
      userName: 'Mark',
      firstName: 'Otto',
      mobileNumber: '00000',
      email: '@mark'
    },
    {
      id: '12',
      userName: 'Jacob',
      firstName: 'Thornton',
      mobileNumber: '00000',
      email: '@jacob'
    },
    {
      id: '13',
      userName: 'Haik',
      firstName: 'Hakob',
      mobileNumber: '00000',
      email: '@haik'
    },
    {
      id: '14',
      userName: 'Garegin',
      firstName: 'Jirair',
      mobileNumber: '00000',
      email: '@garegin'
    },
    {
      id: '15',
      userName: 'Krikor',
      firstName: 'Bedros',
      mobileNumber: '00000',
      email: '@krikor'
    }*/
  ];

  constructor(private http: HttpService) { }

  getUsers(): Observable<any> {
    return this.http.get('/user/getUsers').map(req => req.json())
  }
  /*getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.usersData);
      }, 1000);
    });
  }*/

  // getUserById(userId: string): any {
  //   const len: number = this.usersData.length;

  //   for (let i = 0; i < len; i++) {
  //     if (this.usersData[i].id == userId) {
  //       return this.usersData[i];
  //     }
  //   }

  //   return null;
  // }

  createUser(user: any): Observable<any> {
    return this.http.post('/user/createUser', user).map(req => req.json())
    /*user.id = this.usersData.length + 1 + "";
    this.usersData.push(user);
    return Observable.of(user);*/
  }
  deleteUser(user: any): Observable<any> {
    return this.http.get('/user/activateDeactivateUser/' + user).map(req => req.json());
  }

  getUserById(userId: any): Observable<any> {
    return this.http.get('/user/getUserByUserId/' + userId).map(req => req.json())
  }

  updateUser(user: any): Observable<any> {
    return this.http.put('/user/updateUser', user).map(req => req.json())
  }

  resetPassword(email: any): Observable<any> {
    return this.http.post('/password/resetPassword', email).map(req => req.json())
  }

  confirmPassword (user: any): Observable<any> {
    return this.http.post('/password/confirmPassword', user).map(req => req.json())
  }

  // updateUser(user: any): Observable<any> {
  //   const len: number = this.usersData.length;

  //   for (let i = 0; i < len; i++) {
  //     if (this.usersData[i].id == user.id) {
  //       this.usersData[i] = user;
  //       return Observable.of(user);
  //     }
  //   }
  //   return Observable.of(user);
  // }

  getRoles(): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/role/getAllRoleDefinition', options).map(roles => roles.json());
  }
}
// const items: TreeviewItem[] = [
//   new TreeviewItem({ text: 'Admin', value: 'admin', checked: false }),
//   new TreeviewItem({ text: 'Manager', value: 'manager', checked: false }),
//   new TreeviewItem({ text: 'Employee', value: 'employee', checked: false })
// ]
//  return items;
//}
//}

export interface User {
  id?: string;
  userName: string;
  password?: string;
  confPassword?: string;
}
