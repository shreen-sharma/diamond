import { CreateUser } from './components/users/createUser/createUser.component';
import { CreateRole } from './components/roles/createRole/createRole.component';
import { Routes, RouterModule } from '@angular/router';

import { UserManagement } from './userManagement.component';
import { Users } from './components/users/users.component';
import { Roles } from './components/roles/roles.component';
import { UserProfile } from'./components/users/userProfile/userProfile.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: UserManagement,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: Users },
      { path: 'createUser', component: CreateUser },
      { path: 'editUser/:userId', component: CreateUser },
      { path: 'roles', component: Roles },
      { path: 'createRole', component: CreateRole },
      { path: 'editRole/:roleId', component: CreateRole },
      { path: 'userProfile/:username', component: UserProfile },

    ]
  }
];

export const routing = RouterModule.forChild(routes);
