import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleAComponent } from './module-a/module-a.component';
import { ModuleARoutingModule } from './module-a-routing.module';

@NgModule({
  declarations: [
    ModuleAComponent
  ],
  imports: [
    CommonModule,
    ModuleARoutingModule
  ]
})
export class ModuleAModule {
}
