import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleBComponent } from './module-b/module-b.component';
import { ModuleBRoutingModule } from './module-b-routing.module';

@NgModule({
  declarations: [
    ModuleBComponent
  ],
  imports: [
    CommonModule,
    ModuleBRoutingModule
  ]
})
export class ModuleBModule {
}
