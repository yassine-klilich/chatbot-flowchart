import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { TitleCasePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { OperatorType } from '../../../core/models';
import { FlowchartComponent } from '../flowchart.component';
import { OperatorComponent } from '../operator/operator.component';
import { uuid } from '@jsplumb/browser-ui';

let _countID: number = 0;

@Component({
  selector: 'app-flowchart-menu',
  standalone: true,
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger, TitleCasePipe],
  templateUrl: './flowchart-menu.component.html',
  styleUrl: './flowchart-menu.component.css',
})
export class FlowchartMenuComponent {
  flowchartComponent = inject(FlowchartComponent);

  @Input() menu!: OperatorType[];
  @Input() parent!: OperatorComponent;

  _addOperator(menu: OperatorType) {
    this.flowchartComponent.addOperator({
      _id: uuid(),
      type: menu,
      title: '',
      data: {
        content: '',
      },
      parentOperator: this.parent.data._id,
    });
  }
}
