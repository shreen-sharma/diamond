import { Routes, RouterModule } from '@angular/router';

import { Login } from './login.component';
import { ModuleWithProviders } from '@angular/core';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Login
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
