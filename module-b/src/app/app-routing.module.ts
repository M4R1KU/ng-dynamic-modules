import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        loadChildren: () => import('./module-b/module-b.module').then(m => m.ModuleBModule)
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
