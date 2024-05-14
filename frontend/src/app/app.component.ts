import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowchartComponent } from './flowchart/flowchart.component';
import { provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucideInfo } from '@ng-icons/lucide';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlowchartComponent],
  viewProviders: [provideIcons({ lucideTrash2, lucideInfo })],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
