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
import { FlowchartService, Operator } from '../services/flowchart.service';
import { OperatorComponent } from './operator/operator.component';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';

@Component({
  selector: 'app-flowchart',
  standalone: true,
  imports: [OperatorComponent],
  templateUrl: './flowchart.component.html',
  styleUrl: './flowchart.component.css',
})
export class FlowchartComponent implements AfterViewInit {
  flowchartService = inject(FlowchartService);
  @ViewChild('flowchartContainer') container!: ElementRef;
  @ViewChildren(OperatorComponent) operators!: QueryList<OperatorComponent>;
  panzoomController!: PanzoomObject;

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
    for (let i = 0; i < this.operators.length; i++) {
      const operator = this.operators.get(i);
      if (operator) {
        operator.connection = this.drawConnection(operator);
      }
    }
    this.flowchartService.changes.subscribe((newOperator) => {
      newOperator.connection = this.drawConnection(newOperator);
    });
    this.initPanZoom();
  }

  drawConnection(operator: OperatorComponent): Connection | null {
    if (operator.data.parentOperator) {
      const parentOperator = this.operators.find(
        (_operator) => _operator.data.id == operator.data.parentOperator
      );
      if (parentOperator) {
        return this.flowchartService.instance.connect({
          anchors: ['Bottom', 'Top'],
          source: parentOperator.host.nativeElement,
          target: operator.host.nativeElement,
          detachable: false,
          paintStyle: { stroke: 'gray', strokeWidth: 1 },
          endpointStyle: { fill: 'transparent' },
          connector: 'Flowchart',
        });
      }
    }
    return null;
  }

  onRemove(operator: Operator) {
    const index = this.flowchartService.operators.indexOf(operator);
    if (index > -1) {
      if (operator.parentOperator) {
        const nextOperator = this.flowchartService.operators.find(
          (i) => i.parentOperator == operator.id
        );
        if (nextOperator) {
          nextOperator.position = operator.position;
          nextOperator.parentOperator = operator.parentOperator;
          const nextOperatorComp = this.operators.find(
            (wid) => wid.data.id == nextOperator.id
          );
          if (nextOperatorComp && nextOperatorComp.connection) {
            this.flowchartService.instance.deleteConnection(
              nextOperatorComp.connection
            );
            nextOperatorComp.connection = this.drawConnection(nextOperatorComp);
            setTimeout(() => {
              this.flowchartService.instance.revalidate(
                nextOperatorComp.host.nativeElement
              );
            });
          }
        }
      }
      this.flowchartService.operators.splice(index, 1);
    }
  }

  setZoom(value: number) {
    this.panzoomController.zoom(value);
  }

  initPanZoom() {
    this.panzoomController = Panzoom(this.container.nativeElement, {
      minScale: -100,
      maxScale: 200,
      contain: 'outside',
    });

    this.container.nativeElement.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        this.panzoomController.zoomWithWheel(event);
      }
    );

    this.container.nativeElement.addEventListener(
      'panzoomchange',
      (event: any) => {
        this.flowchartService.instance.repaintEverything();
      }
    );
  }
}
