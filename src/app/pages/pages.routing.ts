import { AuthenticationGuard } from '../core/authentication';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { Pages } from './pages.component';
// import { ChangePasswordComponent } from './change-password/change-password.component';


// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    canActivate: [AuthenticationGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'masters', loadChildren: './masters/masters.module#MastersModule' },
      { path: 'userManagement', loadChildren: './userManagement/userManagement.module#UserManagementModule' },
      { path: 'account', loadChildren: './account/account.module#AccountModule' },
      { path: 'company', loadChildren: './company/company.module#CompanyModule' },
      { path: 'stockManagement', loadChildren: './stockManagement/stockManagement.module#StockManagementModule' },
      { path: 'transaction', loadChildren: './transaction/transaction.module#TransactionModule' },
      { path: 'utility', loadChildren: './utility/utility.module#UtilityModule' },
      { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' }
      // { path: 'change-password', component: ChangePasswordComponent}
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
