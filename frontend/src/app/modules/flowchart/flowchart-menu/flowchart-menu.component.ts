import { Component, Input, inject } from '@angular/core';
import {
  FlowchartService,
  OperatorType,
} from '../../../services/flowchart.service';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { TitleCasePipe } from '@angular/common';
import { OperatorComponent } from '../operator/operator.component';

let _countID: number = 0;

@Component({
  selector: 'app-flowchart-menu',
  standalone: true,
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger, TitleCasePipe],
  templateUrl: './flowchart-menu.component.html',
  styleUrl: './flowchart-menu.component.css',
})
export class FlowchartMenuComponent {
  flowchartService = inject(FlowchartService);

  @Input() menu!: OperatorType[];
  @Input() parent!: OperatorComponent;

  _addOperator(menu: OperatorType) {
    const { top, left, height } = getComputedStyle(
      this.parent.host.nativeElement
    );

    this.flowchartService.addOperator({
      _id: this._generateRandomId(),
      type: menu,
      title: '',
      data: {
        content: '',
      },
      position: {
        top: parseInt(top) + parseInt(height) + 30,
        left: parseInt(left),
      },
      parentOperator: this.parent.data._id,
    });
  }

  _generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
