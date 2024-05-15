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
import {
  FlowchartService,
  OperatorScript,
} from '../../services/flowchart.service';
import { OperatorComponent } from './operator/operator.component';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { Chat } from '../../services/chat-api.service';

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
        (_operator) => _operator.data._id == operator.data.parentOperator
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

  onRemove(operator: OperatorScript) {
    const index = this.flowchartService.operators.indexOf(operator);
    if (index > -1) {
      if (operator.parentOperator) {
        const nextOperator = this.flowchartService.operators.find(
          (i) => i.parentOperator == operator._id
        );
        if (nextOperator) {
          nextOperator.position = operator.position;
          nextOperator.parentOperator = operator.parentOperator;
          const nextOperatorComp = this.operators.find(
            (wid) => wid.data._id == nextOperator._id
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
    this.panzoomController.pan(0, 0);
  }

  initPanZoom() {
    this.panzoomController = Panzoom(this.container.nativeElement, {
      minScale: -50,
      maxScale: 50,
      contain: 'outside',
      excludeClass: 'operator',
    });

    this.container.nativeElement.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        this.panzoomController.zoomWithWheel(event);
      }
    );
  }

  submit() {
    const dataSubmit: Chat = {
      title: 'Chat',
      operators: this.flowchartService.operators,
    };

    console.log(dataSubmit);
  }
}
