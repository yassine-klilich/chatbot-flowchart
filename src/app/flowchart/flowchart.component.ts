import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { Connection, newInstance } from '@jsplumb/browser-ui';
import { FlowchartService, Widget } from '../services/flowchart.service';
import { WidgetComponent } from './widget/widget.component';

@Component({
  selector: 'app-flowchart',
  standalone: true,
  imports: [WidgetComponent],
  templateUrl: './flowchart.component.html',
  styleUrl: './flowchart.component.css',
})
export class FlowchartComponent implements AfterViewInit {
  flowchartService = inject(FlowchartService);
  @ViewChild('flowchartContainer') container!: ElementRef;
  @ViewChildren(WidgetComponent) widgets!: QueryList<WidgetComponent>;

  ngOnInit() {
    const container = document.getElementById('flowchartContainer');
    if (container) {
      this.flowchartService.instance = newInstance({
        container: container,
        elementsDraggable: false,
      });
    }
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < this.widgets.length; i++) {
      const widget = this.widgets.get(i);
      if (widget) {
        widget.connection = this.drawConnection(widget);
      }
    }
    this.flowchartService.changes.subscribe((newWidget) => {
      newWidget.connection = this.drawConnection(newWidget);
    });
  }

  drawConnection(widget: WidgetComponent): Connection | null {
    if (widget.data.parentWidget) {
      const parentWidget = this.widgets.find(
        (_widget) => _widget.data.id == widget.data.parentWidget
      );
      if (parentWidget) {
        return this.flowchartService.instance.connect({
          anchors: ['Bottom', 'Top'],
          source: parentWidget.host.nativeElement,
          target: widget.host.nativeElement,
          detachable: false,
          paintStyle: { stroke: 'gray', strokeWidth: 1 },
          endpointStyle: { fill: 'transparent' },
          connector: 'Flowchart',
        });
      }
    }
    return null;
  }

  onRemove(widget: Widget) {
    const index = this.flowchartService.widgets.indexOf(widget);
    if (index > -1) {
      if (widget.parentWidget) {
        const nextWidget = this.flowchartService.widgets.find(
          (i) => i.parentWidget == widget.id
        );
        if (nextWidget) {
          nextWidget.position = widget.position;
          nextWidget.parentWidget = widget.parentWidget;
          const nextWidgetComp = this.widgets.find(
            (wid) => wid.data.id == nextWidget.id
          );
          if (nextWidgetComp && nextWidgetComp.connection) {
            this.flowchartService.instance.deleteConnection(
              nextWidgetComp.connection
            );
            nextWidgetComp.connection = this.drawConnection(nextWidgetComp);
            setTimeout(() => {
              this.flowchartService.instance.revalidate(
                nextWidgetComp.host.nativeElement
              );
            });
          }
        }
      }
      this.flowchartService.widgets.splice(index, 1);
    }
  }
}
