import { Routes, RouterModule }  from '@angular/router';

import { System } from './system.component';
import { SystemManager } from './components/systemManager/systemManager.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: System,
    children: [
      { path: 'ckeditor', component: SystemManager }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
