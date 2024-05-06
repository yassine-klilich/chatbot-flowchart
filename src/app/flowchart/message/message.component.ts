import { OverlayModule } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Connection } from '@jsplumb/browser-ui';
import { NgIconComponent } from '@ng-icons/core';
import {
  FlowchartService,
  Widget,
  WidgetType,
} from '../../services/flowchart.service';
import { FlowchartMenuComponent } from '../flowchart-menu/flowchart-menu.component';
import { FlowchartComponent } from '../flowchart.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgIconComponent, FormsModule, FlowchartMenuComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  host: {
    class: 'absolute',
    '[style.top]': 'data.position.top + "px"',
    '[style.left]': 'data.position.left + "px"',
  },
})
export class MessageComponent {
  host = inject(ElementRef);
  flowchart = inject(FlowchartComponent);
  flowchartService = inject(FlowchartService);

  title: string = '';
  connection?: Connection | null;
  menu: WidgetType[] = ['message', 'collect'];

  @Input() data!: Widget;
  @Output() onRemove = new EventEmitter<void>();

  ngOnInit() {}

  ngAfterViewInit() {
    this.flowchartService.instance.addEndpoint(this.host.nativeElement, {
      endpoint: 'Blank',
      connector: 'Flowchart',
    });
    this.flowchartService.changes.next(this);
  }

  ngOnDestroy() {
    console.log(this.data.id);
  }

  deleteWidget() {
    if (this.connection) {
      this.flowchartService.instance.deleteConnection(this.connection);
    }
    this.onRemove.emit();
  }
}
