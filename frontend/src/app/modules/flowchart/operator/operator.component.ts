import { TitleCasePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { Connection } from '@jsplumb/browser-ui';
import { NgIconComponent } from '@ng-icons/core';
import { Operator } from '../../../core/models';
import { FlowchartService } from '../../../services/flowchart.service';
import { FlowchartMenuComponent } from '../flowchart-menu/flowchart-menu.component';
import { FlowchartComponent } from '../flowchart.component';
import { ChoiceComponent } from './choice/choice.component';
import { OptionComponent } from './choice/option/option.component';
import { CollectDataComponent } from './collect-data/collect-data.component';
import { EndComponent } from './end/end.component';
import { MessageComponent } from './message/message.component';
import { AssistantComponent } from './assistant/assistant.component';
import { TriggerComponent } from './assistant/trigger/trigger.component';
import { GoToComponent } from './go-to/go-to.component';
import { ContactAgentComponent } from './contact-agent/contact-agent.component';

@Component({
  selector: 'app-operator',
  standalone: true,
  imports: [
    NgIconComponent,
    FlowchartMenuComponent,
    MessageComponent,
    CollectDataComponent,
    ChoiceComponent,
    OptionComponent,
    AssistantComponent,
    TriggerComponent,
    GoToComponent,
    ContactAgentComponent,
    EndComponent,
    TitleCasePipe,
  ],
  templateUrl: './operator.component.html',
  styleUrl: './operator.component.css',
  host: {
    class: 'absolute operator',
  },
})
export class OperatorComponent implements AfterViewInit, OnDestroy {
  host = inject(ElementRef<HTMLElement>);
  flowchartService = inject(FlowchartService);
  flowchartComponent = inject(FlowchartComponent);

  @Input() data!: Operator;
  @Output() onRemove = new EventEmitter<void>();

  @ViewChild('operator') operatorComp!: any;
  connection?: Connection | null;

  ngAfterViewInit() {
    this.flowchartService.instance.addEndpoint(this.host.nativeElement, {
      endpoint: 'Blank',
      connector: 'Flowchart',
    });
    this.flowchartService.changes.next(this);
  }

  ngOnDestroy(): void {
    this.flowchartService.remove.next(this);
  }

  deleteOperator() {
    if (this.connection) {
      this.flowchartService.instance.deleteConnection(this.connection);
    }
    this.onRemove.emit();
  }

  getPosition() {
    const { top, left, height } = getComputedStyle(this.host.nativeElement);

    return {
      top: (this.host.nativeElement.style.top =
        parseInt(top) + parseInt(height) + 30 + 'px'),
      left: (this.host.nativeElement.style.left = parseInt(left) + 'px'),
    };
  }

  setPosition(top: number, left: number) {
    this.host.nativeElement.style.top = top + 'px';
    this.host.nativeElement.style.left = left + 'px';
  }

  calculatePosition(): void {
    if (this.data.parentOperator) {
      const parentOperator = this.flowchartComponent.operators.find(
        (_operator) => _operator.data._id == this.data.parentOperator
      );
      if (parentOperator) {
        const { top, left, height } = getComputedStyle(
          parentOperator.host.nativeElement
        );

        this.setPosition(parseInt(top) + parseInt(height) + 30, parseInt(left));
      }
    } else {
      const flowchartContainer = document.getElementById('#flowchartContainer');

      this.host.nativeElement.style.top = '48px';
      this.host.nativeElement.style.left =
        (flowchartContainer?.offsetWidth || 5000) / 2 + 'px';
    }
  }
}
