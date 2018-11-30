import { CreateRole } from './components/roles/createRole/createRole.component';
import { CreateUser } from './components/users/createUser/createUser.component';
import { RoleService } from './components/roles/role.service';
import { Roles } from './components/roles';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { UserService } from './components/users/user.service';
import { Users } from './components/users/users.component';
import { UserManagement } from './userManagement.component';
import { routing } from './userManagement.routing';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TreeviewModule } from 'ngx-treeview';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { UserProfile } from './components/users/userProfile/userProfile.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    Ng2SmartTableModule,
    routing,
    TreeviewModule.forRoot(),
    NgbModule.forRoot(),
    SharedModule
  ],
  declarations: [
    UserManagement,
    Users,
    CreateUser,
    Roles,
    CreateRole,
    UserProfile
  ],
  providers: [
    UserService,
    RoleService
  ],
  // exports: [UserService]
})
export class UserManagementModule {
}
