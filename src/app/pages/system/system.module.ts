import { SystemManager } from './components/systemManager/index';
import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { System } from './system.component';
import { routing } from './system.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    SystemManager,
    System
  ]
})
export class SystemModule {
}
