import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleBComponent } from './module-b/module-b.component';
import { ModuleBRoutingModule } from './module-b-routing.module';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTableModule
} from '@angular/material';

@NgModule({
  declarations: [
    ModuleBComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ModuleBRoutingModule
  ]
})
export class ModuleBModule {
}
