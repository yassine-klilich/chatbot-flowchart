import { Component, Input, inject } from '@angular/core';
import {
  FlowchartService,
  OperatorType,
} from '../../services/flowchart.service';
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

  @Input() menu!: OperatorType[];
  @Input() parent!: any;

  _addOperator(menu: OperatorType) {
    const { top, left, height } = getComputedStyle(
      this.parent.host.nativeElement
    );

    this.flowchartService.addOperator({
      id: --_countID,
      type: menu,
      content: '',
      position: {
        top: parseFloat(top) + parseFloat(height) + 30,
        left: parseFloat(left),
      },
      parentOperator: this.parent.data.id,
    });
  }
}
