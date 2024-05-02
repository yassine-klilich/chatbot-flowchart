import { Component, Input, inject } from '@angular/core';
import { FlowchartService, WidgetType } from '../../services/flowchart.service';
import { MessageComponent } from '../message/message.component';

let _countID: number = 0;

@Component({
  selector: 'app-flowchart-menu',
  standalone: true,
  imports: [],
  templateUrl: './flowchart-menu.component.html',
  styleUrl: './flowchart-menu.component.css',
})
export class FlowchartMenuComponent {
  flowchartService = inject(FlowchartService);

  @Input() menu!: WidgetType[];
  @Input() parent!: any;

  _addWidget(menu: WidgetType) {
    this.flowchartService.addWidget({
      id: --_countID,
      type: menu,
      content: '',
      position: {
        top: this.parent.data.position.top + 180,
        left: this.parent.data.position.left,
      },
      parentWidget: this.parent.data.id,
    });
  }
}
