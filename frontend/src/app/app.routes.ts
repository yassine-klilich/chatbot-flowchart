import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { FlowchartComponent } from './modules/flowchart/flowchart.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'flowchart/:id',
    component: FlowchartComponent,
  },
];
