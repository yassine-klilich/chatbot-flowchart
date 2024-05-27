import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { uuid } from '@jsplumb/browser-ui';
import { NgIconComponent } from '@ng-icons/core';
import { Operator } from '../../../../core/models';
import { FlowchartService } from '../../../../services/flowchart.service';
import { FlowchartComponent } from '../../flowchart.component';
import { OptionComponent } from './option/option.component';

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
  cdr = inject(ChangeDetectorRef);
  private _optionsCounter: number = 0;
  options!: OptionComponent[];

  constructor() {}

  ngOnInit(): void {
    this.flowchartComponent.operators.changes.subscribe((e) => {
      this.options = this.flowchartComponent.operators.filter(
        (o) => o.data.parentOperator == this.data._id
      );
      this.cdr.detectChanges();
    });
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
