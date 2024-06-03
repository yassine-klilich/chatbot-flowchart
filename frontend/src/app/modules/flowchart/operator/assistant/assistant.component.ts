import { ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { Operator } from '../../../../core/models';
import { FormsModule } from '@angular/forms';
import { TriggerComponent } from './trigger/trigger.component';
import { FlowchartService } from '../../../../services/flowchart.service';
import { FlowchartComponent } from '../../flowchart.component';
import { OperatorComponent } from '../operator.component';
import { NgIconComponent } from '@ng-icons/core';
import { uuid } from '@jsplumb/browser-ui';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [FormsModule, NgIconComponent],
  templateUrl: './assistant.component.html',
  styleUrl: './assistant.component.css',
})
export class AssistantComponent {
  flowchartComponent = inject(FlowchartComponent);
  flowchartService = inject(FlowchartService);
  operatorComp = inject(OperatorComponent);
  cdr = inject(ChangeDetectorRef);

  @Input() data!: Operator;
  triggers!: OperatorComponent[];
  private _triggersCounter: number = 0;

  ngOnInit(): void {
    this.flowchartComponent.operators.changes.subscribe((e) => {
      this.triggers = this.flowchartComponent.operators.filter(
        (o) => o.data.parentOperator == this.data._id
      );
      this._triggersCounter = this.triggers.length;
      this.updateTreePosition();
      this.cdr.detectChanges();
    });
  }

  updateTreePosition() {
    const spaceBetweenTriggers = 40;
    const totalWidthOfTriggers =
      this.triggers.reduce((total, trigger) => {
        const { width } = getComputedStyle(trigger.host.nativeElement);
        return total + parseInt(width);
      }, 0) +
      (this.triggers.length - 1) * spaceBetweenTriggers;

    const { top, left, height, width } = getComputedStyle(
      this.operatorComp.host.nativeElement
    );

    this.triggers.forEach((trigger, index) => {
      if (trigger.connection) {
        this.flowchartService.instance.deleteConnection(trigger.connection);
      }
      const _left =
        parseInt(left) + parseFloat(width) / 2 - totalWidthOfTriggers / 2;

      const { width: optionWidth } = getComputedStyle(
        trigger.host.nativeElement
      );

      trigger.setPosition(
        parseInt(top) + parseInt(height) + 80,
        _left + index * (parseInt(optionWidth) + spaceBetweenTriggers)
      );
      trigger.connection = this.flowchartComponent.drawConnection(trigger);
      this.flowchartService.instance.revalidate(trigger.host.nativeElement);

      this._updateTriggerRelativesPosition(trigger);
    });
  }

  private _updateTriggerRelativesPosition(option: OperatorComponent) {
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

  addTrigger() {
    this.flowchartComponent.addOperator({
      _id: uuid(),
      type: 'trigger',
      title: '',
      script: {
        content: 'Trigger ' + ++this._triggersCounter,
      },
      parentOperator: this.data._id,
    });
  }

  deleteTrigger(option: OperatorComponent) {
    option.deleteOperator();
  }
}
