import { Component, Input, inject } from '@angular/core';
import { FlowchartService, WidgetType } from '../../services/flowchart.service';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';

let _countID: number = 0;

@Component({
  selector: 'app-flowchart-menu',
  standalone: true,
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger],
  templateUrl: './flowchart-menu.component.html',
  styleUrl: './flowchart-menu.component.css',
})
export class FlowchartMenuComponent {
  flowchartService = inject(FlowchartService);

  @Input() menu!: WidgetType[];
  @Input() parent!: any;

  _addWidget(menu: WidgetType) {
    const { bottom, left } =
      this.parent.host.nativeElement.getBoundingClientRect();

    this.flowchartService.addWidget({
      id: --_countID,
      type: menu,
      content: '',
      position: {
        top: bottom + 30,
        left: left,
      },
      parentWidget: this.parent.data.id,
    });
  }
}
