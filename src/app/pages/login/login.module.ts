import { HierarchyRelationService } from '../company/components/hierarchyRelation';
import { NgModule, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { Login } from './login.component';
import { routing } from './login.routing';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../userManagement/components/users/user.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';

@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    NgbModule
  ],
  declarations: [
    Login,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent
  ],
  providers: [
    HierarchyRelationService,
    UserService
  ],
  entryComponents: [ForgotPasswordComponent],
  exports: [ForgotPasswordComponent]
})
export class LoginModule { }
