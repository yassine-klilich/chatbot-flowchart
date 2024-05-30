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
import { OptionComponent } from './option/option.component';

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
    const spaceBetweenOptions = 40;
    const totalWidthOfOptions =
      this.options.reduce((total, option) => {
        const { width } = getComputedStyle(option.host.nativeElement);
        return total + parseInt(width);
      }, 0) +
      (this.options.length - 1) * spaceBetweenOptions;

    const { top, left, height, width } = getComputedStyle(
      this.operatorComp.host.nativeElement
    );

    this.options.forEach((option, index) => {
      if (option.connection) {
        this.flowchartService.instance.deleteConnection(option.connection);
      }
      const _left =
        parseInt(left) + parseFloat(width) / 2 - totalWidthOfOptions / 2;

      const { width: optionWidth } = getComputedStyle(
        option.host.nativeElement
      );

      option.setPosition(
        parseInt(top) + parseInt(height) + 80,
        _left + index * (parseInt(optionWidth) + spaceBetweenOptions)
      );
      option.connection = this.flowchartComponent.drawConnection(option);
      this.flowchartService.instance.revalidate(option.host.nativeElement);

      this._updateOptionRelativesPosition(option);
    });
  }

  private _updateOptionRelativesPosition(option: OperatorComponent) {
    let nextOperatorComp = this.flowchartComponent.operators.find(
      (wid) => wid.data.parentOperator == option.data._id
    );
    if (nextOperatorComp) {
      while (nextOperatorComp?.connection) {
        if (nextOperatorComp && nextOperatorComp.connection) {
          this.flowchartComponent.drawOperator(nextOperatorComp);
        }
        nextOperatorComp = this.flowchartComponent.operators.find(
          (op) => op.data.parentOperator == nextOperatorComp?.data._id
        );
      }
    }
  }

  addOption() {
    this.flowchartComponent.addOperator({
      _id: uuid(),
      type: 'option',
      title: '',
      script: {
        content: 'Option ' + ++this._optionsCounter,
      },
      parentOperator: this.data._id,
    });
  }

  deleteOption(option: OperatorComponent) {
    option.deleteOperator();
  }
}

export interface ChoiceOption {
  label: string;
  value: string;
}
