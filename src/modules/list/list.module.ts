import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { ListComponent } from './list.component';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
  ],
  declarations: [ListComponent],
  exports: [ListComponent],
})
export class ListModule { }
