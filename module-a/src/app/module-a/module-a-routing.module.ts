import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleAComponent } from './module-a/module-a.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ModuleAComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ModuleARoutingModule {
}
