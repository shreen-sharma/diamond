import { HttpService } from '../http';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

export interface Credentials {
  // Customize received credentials here
  username: string;
  company: string;
  access_token: string;
  interval_token: string;
  expires: string;
}

export interface LoginContext {
  username: string;
  password: string;
  company: string;
  group: string;
  remember?: boolean;
}

const credentialsKey = 'credentials';
const userRoleKey = 'userRole';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {

  private _credentials: Credentials;
  private _userRole: any;


  constructor(private router: Router, private http: Http) {
    this._credentials = JSON.parse(sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey));
    this._userRole = JSON.parse(localStorage.getItem(userRoleKey));
  }

  /**
   * Authenticates the user.
   * @param {LoginContext} context The login parameters.
   * @return {Observable<Credentials>} The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    // Replace by proper authentication call
    const authHeader = new Headers();
    authHeader.append('Authorization', 'Basic bXktdHJ1c3RlZC1jbGllbnQ6c2VjcmV0');
    authHeader.append('Content-Type', 'application/x-www-form-urlencoded');
    const options = new RequestOptions({ headers: authHeader });
    debugger;
    //const userName = context.username + ':' + context.company + ':' + context.group;
    const url = environment.serverUrl + '/oauth/token?grant_type=password&username=' + context.username + "&password=" + context.password + "&companyId=" + context.company;
    return this.http.post(url, {}, options).map(user => {
      const userData = user.json();

      userData.username = context.username;
      userData.company = context.company;
      this.setCredentials(userData, context.remember);

      return userData;
    })

    /* let data = {username: context.username, token: '2313123'};
    this.setCredentials(data, context.remember);
    return Observable.of(data); */
  }

  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    this.router.navigate(['./login']);
    return Observable.of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials {
    return this._credentials;
  }

  loadUserRole(): Observable<any> {
    debugger
    const authHeader = new Headers();
    authHeader.append('Accept', 'application/json');
    authHeader.append('Content-Type', 'application/json');
    authHeader.append('Authorization', 'Bearer ' + this.credentials.access_token);
    let options = new RequestOptions();
    options.headers = authHeader;

    //  this.getLoggedInUserPermission();
    // this.http.get('/user/getLoggedInUserPermission').map(res => {
    //   debugger;
    //   const permission: any[] = res.json();
    //     sessionStorage.setItem('UserPermission',JSON.stringify(permission));
    //   // 
    // })

    let url: string = environment.serverUrl + '/user/menuRoleByUsername/';

    return this.http.get(url + this._credentials.username).map(res => {
      const roles: any[] = res.json();
      this._userRole = { roleNames: [], menus: [], permission: {} };
      roles.forEach(role => {
        // sessionStorage.setItem('addRec', (role.roleDTO.addRec));
        // sessionStorage.setItem('deleteRec', role.roleDTO.deleteRec);
        // sessionStorage.setItem('modifyRec', role.roleDTO.modifyRec);
        // sessionStorage.setItem('printRec', role.roleDTO.printRec);
        // sessionStorage.setItem('viewRec', role.roleDTO.viewRec);

        this.mergeRole(role);
      });
      localStorage.setItem(userRoleKey, JSON.stringify(this._userRole));

      return this._userRole;
    })
  }

  getUserRole(): any {

    return this._userRole;
  }

  private mergeRole(role: any) {
    let roleDto = role.roleDTO;
    this._userRole.roleNames.push(roleDto['roleName']);

    this._userRole.permission['viewRec'] = roleDto['viewRec'] == 'Y' ? 'Y' : this._userRole.permission['viewRec'];
    this._userRole.permission['addRec'] = roleDto['addRec'] == 'Y' ? 'Y' : this._userRole.permission['addRec'];
    this._userRole.permission['deleteRec'] = roleDto['deleteRec'] == 'Y' ? 'Y' : this._userRole.permission['deleteRec'];
    this._userRole.permission['modifyRec'] = roleDto['modifyRec'] == 'Y' ? 'Y' : this._userRole.permission['modifyRec'];
    this._userRole.permission['printRec'] = roleDto['printRec'] == 'Y' ? 'Y' : this._userRole.permission['printRec'];

    const len = role.menuList.length;

    for (let i = 0; i < len; i++) {
      if (this._userRole.menus.indexOf(role.menuList[i]) === -1) {
        this._userRole.menus.push(role.menuList[i]);
      }
    }
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credentials The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: any, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
      localStorage.removeItem(userRoleKey);
    }
  }

  // getLoggedInUserPermission(){
  //   this.http.get("/user/getLoggedInUserPermission").o
  // }

  getUserAccessOfMenu(menuName: string) {
    debugger;
    let list: any[] = [];
    const permission = $.parseJSON(sessionStorage.getItem('UserPermission'));
    for (var i = 0; i < permission.length; i++) {
      // look for the entry with a matching `code` value
      if (permission[i].authority.includes(menuName)) {
        list.push(permission[i].authority.split('_')[0]);
        // we found it
        // obj[i].name is the matched result
      }
    }
    return list;
  }


  getLoggedInUserPermission(): Observable<any> {
    debugger;
    const authHeader = new Headers();
    authHeader.append('Accept', 'application/json');
    authHeader.append('Content-Type', 'application/json');
    authHeader.append('Authorization', 'Bearer ' + this.credentials.access_token);
    let options = new RequestOptions();
    options.headers = authHeader;

    //  this.getLoggedInUserPermission();
    // this.http.get('/user/getLoggedInUserPermission').map(res => {
    //   debugger;
    //   const permission: any[] = res.json();
    //     sessionStorage.setItem('UserPermission',JSON.stringify(permission));
    //   // 
    // })

    let url: string = environment.serverUrl + '/user/getLoggedInUserPermission';

  //  return this.http.get(url).map(res => {
    return this.http.get('/user/getLoggedInUserPermission').map(res => {
      console.log('permission');

      //return this.http.get('/user/getLoggedInUserPermission').map(res => {
      return res;
      // 
    })
  }

}
