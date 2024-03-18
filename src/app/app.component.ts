import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

import { ChartModule, ListModule } from '../modules';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ChartModule,
    ListModule,
    MatTabsModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent { }