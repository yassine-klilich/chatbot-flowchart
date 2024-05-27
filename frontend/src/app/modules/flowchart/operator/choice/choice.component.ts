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
import { OperatorComponent } from '../operator.component';

@Component({
  selector: 'app-choice',
  standalone: true,
  imports: [FormsModule, NgIconComponent],
  templateUrl: './choice.component.html',
  styleUrl: './choice.component.css',
})
export class ChoiceComponent implements OnInit {
  flowchartComponent = inject(FlowchartComponent);
  flowchartService = inject(FlowchartService);
  operatorComp = inject(OperatorComponent);
  cdr = inject(ChangeDetectorRef);

  @Input() data!: Operator;

  options!: OperatorComponent[];
  private _optionsCounter: number = 0;

  ngOnInit(): void {
    this.flowchartComponent.operators.changes.subscribe((e) => {
      this.options = this.flowchartComponent.operators.filter(
        (o) => o.data.parentOperator == this.data._id
      );
      this._optionsCounter = this.options.length;
      this.setOptionsPosition();
      this.cdr.detectChanges();
    });
  }

  setOptionsPosition() {
    let spaceBetweenOptions = 30;
    let totalWidthOfOptions =
      this.options.reduce((total, option) => {
        const { width } = getComputedStyle(option.host.nativeElement);
        return total + parseInt(width);
      }, 0) +
      (this.options.length - 1) * spaceBetweenOptions;

    const { top, left, height, width } = getComputedStyle(
      this.operatorComp.host.nativeElement
    );

    this.options.forEach((option, index) => {
      let _left =
        parseInt(left) + parseFloat(width) / 2 - totalWidthOfOptions / 2;

      const { width: optionWidth } = getComputedStyle(
        option.host.nativeElement
      );

      option.setPosition(
        parseInt(top) + parseInt(height) + 80,
        _left + index * (parseInt(optionWidth) + spaceBetweenOptions)
      );
      this.flowchartService.instance.revalidate(option.host.nativeElement);
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
