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
  OperatorScript,
} from '../../../services/flowchart.service';
import { Connection } from '@jsplumb/browser-ui';
import { FlowchartMenuComponent } from '../flowchart-menu/flowchart-menu.component';
import { NgIconComponent } from '@ng-icons/core';
import { EndComponent } from './end/end.component';
import { TitleCasePipe } from '@angular/common';

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
    '[style.top]': 'data.position.top + "px"',
    '[style.left]': 'data.position.left + "px"',
  },
})
export class OperatorComponent {
  host = inject(ElementRef);
  flowchartService = inject(FlowchartService);

  @Input() data!: OperatorScript;
  @Output() onRemove = new EventEmitter<void>();

  title: string = '';
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
}
