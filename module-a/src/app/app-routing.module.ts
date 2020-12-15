import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
    {
        path: '',
        loadChildren: () => import('./module-a/module-a.module').then(m => m.ModuleAModule)
    }
], { relativeLinkResolution: 'legacy' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
