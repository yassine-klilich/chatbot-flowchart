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
import { FlowchartService, Widget } from '../../services/flowchart.service';
import { Connection } from '@jsplumb/browser-ui';
import { FlowchartMenuComponent } from '../flowchart-menu/flowchart-menu.component';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [
    NgIconComponent,
    FlowchartMenuComponent,
    MessageComponent,
    CollectDataComponent,
  ],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.css',
  host: {
    class: 'absolute',
    '[style.top]': 'data.position.top + "px"',
    '[style.left]': 'data.position.left + "px"',
  },
})
export class WidgetComponent {
  host = inject(ElementRef);
  flowchartService = inject(FlowchartService);

  @Input() data!: Widget;
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

  deleteWidget() {
    if (this.connection) {
      this.flowchartService.instance.deleteConnection(this.connection);
    }
    this.onRemove.emit();
  }
}
