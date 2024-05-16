import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucideInfo, lucideWorkflow } from '@ng-icons/lucide';
import { FlowchartComponent } from './modules/flowchart/flowchart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlowchartComponent],
  viewProviders: [provideIcons({ lucideTrash2, lucideInfo, lucideWorkflow })],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
