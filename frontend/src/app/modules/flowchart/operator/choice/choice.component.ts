import { Component, Input, OnInit, inject, input } from '@angular/core';
import { Operator } from '../../../../core/models';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { FlowchartComponent } from '../../flowchart.component';
import { uuid } from '@jsplumb/browser-ui';
import { OptionComponent } from './option/option.component';
import { FlowchartService } from '../../../../services/flowchart.service';

@Component({
  selector: 'app-choice',
  standalone: true,
  imports: [FormsModule, NgIconComponent],
  templateUrl: './choice.component.html',
  styleUrl: './choice.component.css',
})
export class ChoiceComponent implements OnInit {
  @Input() data!: Operator;
  flowchartComponent = inject(FlowchartComponent);
  flowchartService = inject(FlowchartService);
  private _optionsCounter: number = 0;
  options!: OptionComponent[];

  constructor() {}

  ngOnInit(): void {
    this.options = this.flowchartComponent.operators.filter(
      (o) => o.data.parentOperator == this.data._id
    );
  }

  addOption() {
    this.flowchartComponent.addOperator({
      _id: uuid(),
      type: 'option',
      title: 'Option ' + this._optionsCounter++,
      script: {
        content: '',
        value: '',
      },
      parentOperator: this.data._id,
    });
  }

  deleteOption(option: ChoiceOption) {}
}

export interface ChoiceOption {
  label: string;
  value: string;
}
