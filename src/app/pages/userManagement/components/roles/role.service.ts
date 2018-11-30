import { HttpService } from '../../../../core/http';
import {Injectable} from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { TreeviewItem } from 'ngx-treeview';

@Injectable()
export class RoleService {

  rolesData = [
    {
      id: 1,
      roleName: 'admin',
      displayName: 'Admin'
    },
    {
      id: 2,
      roleName: 'manage',
      displayName: 'Manager'
    },
    {
      id: 3,
      roleName: 'staff',
      displayName: 'Staff'
    }
  ];

  constructor(private http: HttpService) {}

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.rolesData);
      }, 1000);
    });
  }

  // POST /role/createRoleDefinition
  createRole(role: any): Observable<any> {
    return this.http.post('/role/createRoleDefinition', role).map(req => req.json());
  }

  // POST /role/createRoleDefinition
  deleteRole(role: any): Observable<any> {
    return this.http.delete('/role/deleteRoleDefinitionById/' +role);
  }

  updateRole(role: any): Observable<any> {
    return this.http.put('/role/updateRoleDefinition', role).map(req => req.json());
  }

  // GET /role/getAllRoleDefinition
  getAllRoles(): Observable<any> {
    return this.http.get('/role/getAllRoleDefinition').map(req => req.json());
  }

  // GET /role/getRoleById
  getRoleById(roleId): Observable<any> {
    return this.http.get('/role/getRoleById/' + roleId).map(req => req.json());
  }

  getModuleData(): Observable<any> {
    return this.http.get('/menu/getAllMenu').map(req => req.json());
  }
}

export interface Role {
  roleName: string;
  displayName: string;
  operations?: string[];
  modules?: string[];
}
