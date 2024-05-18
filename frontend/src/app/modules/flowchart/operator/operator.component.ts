import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { MessageComponent } from './message/message.component';
import { CollectDataComponent } from './collect-data/collect-data.component';
import {
  FlowchartService,
} from '../../../services/flowchart.service';
import { Connection } from '@jsplumb/browser-ui';
import { FlowchartMenuComponent } from '../flowchart-menu/flowchart-menu.component';
import { NgIconComponent } from '@ng-icons/core';
import { EndComponent } from './end/end.component';
import { TitleCasePipe } from '@angular/common';
import { FlowchartComponent } from '../flowchart.component';
import { OperatorScript } from '../../../core/models';

@Component({
  selector: 'app-operator',
  standalone: true,
  imports: [
    NgIconComponent,
    FlowchartMenuComponent,
    MessageComponent,
    CollectDataComponent,
    EndComponent,
    TitleCasePipe,
  ],
  templateUrl: './operator.component.html',
  styleUrl: './operator.component.css',
  host: {
    class: 'absolute operator',
  },
})
export class OperatorComponent {
  host = inject(ElementRef<HTMLElement>);
  flowchartService = inject(FlowchartService);
  flowchartComponent = inject(FlowchartComponent);

  @Input() data!: OperatorScript;
  @Output() onRemove = new EventEmitter<void>();

  connection?: Connection | null;

  ngAfterViewInit() {
    this.flowchartService.instance.addEndpoint(this.host.nativeElement, {
      endpoint: 'Blank',
      connector: 'Flowchart',
    });
    this.flowchartService.changes.next(this);
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
      this.host.nativeElement.style.top = '48px';
      this.host.nativeElement.style.left = '188px';
    }
  }
}
