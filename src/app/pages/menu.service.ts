import { Injectable } from '@angular/core';
import { HttpService } from 'app/core/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MenuService {

  constructor(private http: HttpService) {

   }

   getUserMenus():Observable<any>{
     
     return this.http.get('/menu/getLoggedInUserMenus').map(res => res.json());
   }

   getLoggedInUserPermission():Observable<any>{

    return this.http.get('/user/getLoggedInUserPermission').map(res => {
      return res.json();
      // 
    })
  }

}
