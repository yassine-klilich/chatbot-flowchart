import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { FlowchartMenuComponent } from '../../flowchart-menu/flowchart-menu.component';
import { OperatorComponent } from '../operator.component';
import { Operator } from '../../../../core/models';
import { CommonModule } from '@angular/common';
import { FlowchartComponent } from '../../flowchart.component';
import { FlowchartService } from '../../../../services/flowchart.service';

@Component({
  selector: 'app-collect-data',
  standalone: true,
  imports: [NgIconComponent, FormsModule, FlowchartMenuComponent, CommonModule],
  templateUrl: './collect-data.component.html',
  styleUrl: './collect-data.component.css',
})
export class CollectDataComponent implements OnInit {
  flowchartComponent = inject(FlowchartComponent);
  operatorComponent = inject(OperatorComponent);
  flowchartService = inject(FlowchartService);

  @Input() data!: Operator;

  showVariableError: boolean = false;
  previousVariableValue: string | undefined = '';

  ngOnInit(): void {
    if (this.data.script.variable) {
      this.flowchartService.appendVariable(
        this.data.script.variable,
        this.operatorComponent
      );
      this.previousVariableValue = this.data.script.variable;
    }
  }

  onKeyupVariable() {
    if (this.data.script.variable?.length === 0) {
      this.showVariableError = false;
    } else {
      this.showVariableError = !(
        this.data.script.variable &&
        /^[a-zA-Z_-]+$/.test(this.data.script.variable)
      );
    }
  }

  onChangeVariable() {
    this.flowchartService.removeVariable(this.previousVariableValue);
    if (this.data.script.variable && this.data.script.variable?.length > 0) {
      const valid = this.flowchartService.appendVariable(
        this.data.script.variable,
        this.operatorComponent
      );
      if (!valid) {
        this._resetVariable();
      }
    }
    this.previousVariableValue = this.data.script.variable;
  }

  private _resetVariable() {
    this.showVariableError = false;
    this.data.script.variable = this.previousVariableValue;
    if (this.data.script.variable) {
      this.flowchartService.appendVariable(
        this.data.script.variable,
        this.operatorComponent
      );
    }
  }
}
