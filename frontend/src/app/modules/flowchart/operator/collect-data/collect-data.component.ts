import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { FlowchartMenuComponent } from '../../flowchart-menu/flowchart-menu.component';
import { OperatorComponent } from '../operator.component';
import { Operator } from '../../../../core/models';
import { CommonModule } from '@angular/common';
import { FlowchartComponent } from '../../flowchart.component';

@Component({
  selector: 'app-collect-data',
  standalone: true,
  imports: [NgIconComponent, FormsModule, FlowchartMenuComponent, CommonModule],
  templateUrl: './collect-data.component.html',
  styleUrl: './collect-data.component.css',
})
export class CollectDataComponent {
  flowchartComponent = inject(FlowchartComponent);
  operatorComponent = inject(OperatorComponent);
  @Input() data!: Operator;

  showVariableError: boolean = false;

  keyupVariable() {
    if (this.data.script.variable?.length == 0) {
      this.showVariableError = false;
    } else {
      const hasError = this.showVariableError;
      this.showVariableError = !(
        this.data.script.variable &&
        /^[a-zA-Z_-]+$/.test(this.data.script.variable)
      );
      if (hasError && !this.showVariableError) {
        --this.flowchartComponent.errors;
      } else if (!hasError && this.showVariableError) {
        ++this.flowchartComponent.errors;
      }
    }
  }
}
