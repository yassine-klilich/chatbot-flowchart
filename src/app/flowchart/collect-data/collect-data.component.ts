import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FlowchartComponent } from '../flowchart.component';
import {
  FlowchartService,
  Widget,
  WidgetType,
} from '../../services/flowchart.service';
import { Connection } from '@jsplumb/browser-ui';
import { NgIconComponent } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { FlowchartMenuComponent } from '../flowchart-menu/flowchart-menu.component';

@Component({
  selector: 'app-collect-data',
  standalone: true,
  imports: [
    NgIconComponent,
    FormsModule,
    OverlayModule,
    FlowchartMenuComponent,
  ],
  templateUrl: './collect-data.component.html',
  styleUrl: './collect-data.component.css',
  host: {
    class: 'absolute',
    '[style.top]': 'data.position.top + "px"',
    '[style.left]': 'data.position.left + "px"',
  },
})
export class CollectDataComponent {
  host = inject(ElementRef);
  flowchart = inject(FlowchartComponent);
  flowchartService = inject(FlowchartService);

  title: string = '';
  connection?: Connection | null;
  menu: WidgetType[] = ['message', 'collect'];

  @Input() data!: Widget;
  @Output() onRemove = new EventEmitter<void>();

  ngOnInit() {
    this.flowchartService.changes.next(this);
  }

  ngAfterViewInit() {
    this.flowchartService.instance.addEndpoint(this.host.nativeElement, {
      endpoint: 'Blank',
      connector: 'Flowchart',
    });
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
