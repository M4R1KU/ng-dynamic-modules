import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleBComponent } from './module-b/module-b.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ModuleBComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ModuleBRoutingModule {
}
