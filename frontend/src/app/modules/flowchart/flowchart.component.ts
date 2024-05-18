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
import { ActivatedRoute } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';

const DEFAULT_CHAT: Chat = {
  _id: '-1',
  name: 'Chat -1',
  operators: [],
};

@Component({
  selector: 'app-flowchart',
  standalone: true,
  imports: [OperatorComponent, ChatComponent],
  templateUrl: './flowchart.component.html',
  styleUrl: './flowchart.component.css',
})
export class FlowchartComponent implements AfterViewInit {
  flowchartService = inject(FlowchartService);
  route = inject(ActivatedRoute);

  chat!: Chat;
  panzoomController!: PanzoomObject;

  @ViewChild('flowchartContainer') container!: ElementRef;
  @ViewChildren(OperatorComponent) operators!: QueryList<OperatorComponent>;

  ngOnInit() {
    const container = document.getElementById('flowchartContainer');
    if (container) {
      this.flowchartService.instance = newInstance({
        container: container,
        elementsDraggable: false,
      });
    }

    this.route.params.subscribe((params) => {
      const id = params['id'];

      this.chat =
        this.flowchartService.chats.find((i) => i._id == id) || DEFAULT_CHAT;
    });
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < this.operators.length; i++) {
      const operator = this.operators.get(i);
      if (operator) {
        this.drawOperator(operator)
      }
    }
    this.flowchartService.changes.subscribe((newOperator) => {
      this.drawOperator(newOperator)
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

  addOperator(operator: OperatorScript) {
    this.chat.operators.push(operator);
  }

  onRemove(operator: OperatorScript) {
    const index = this.chat.operators.indexOf(operator);
    if (index > -1) {
      if (operator.parentOperator) {
        const nextOperatorComp = this.operators.find(
          (wid) => wid.data.parentOperator == operator._id
        );
        if (nextOperatorComp) {
          nextOperatorComp.data.parentOperator = operator.parentOperator;
          if (nextOperatorComp && nextOperatorComp.connection) {
            this.drawOperator(nextOperatorComp);
          }
        }
      }
      this.chat.operators.splice(index, 1);
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

  drawOperator(operator: OperatorComponent): void {
    if (operator.connection) {
      this.flowchartService.instance.deleteConnection(operator.connection);
    }
    operator.calculatePosition();
    operator.connection = this.drawConnection(operator);
    this.flowchartService.instance.revalidate(operator.host.nativeElement);
  }

  submit() {
    console.log(this.chat);
  }
}
