import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { Widget } from '../../../services/flowchart.service';
import { FlowchartMenuComponent } from '../../flowchart-menu/flowchart-menu.component';
import { WidgetComponent } from '../widget.component';

@Component({
  selector: 'app-collect-data',
  standalone: true,
  imports: [NgIconComponent, FormsModule, FlowchartMenuComponent],
  templateUrl: './collect-data.component.html',
  styleUrl: './collect-data.component.css',
})
export class CollectDataComponent {
  widgetComponent = inject(WidgetComponent);
  @Input() data!: Widget;
}
