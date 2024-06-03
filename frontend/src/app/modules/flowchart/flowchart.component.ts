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
import { FlowchartService } from '../../services/flowchart.service';
import { OperatorComponent } from './operator/operator.component';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { ActivatedRoute } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { Chatbot, Operator } from '../../core/models';
import { ChatbotApiService } from '../../services/chatbot-api.service';
import { ChoiceComponent } from './operator/choice/choice.component';
import { AssistantComponent } from './operator/assistant/assistant.component';

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
  chatbotAPI = inject(ChatbotApiService);

  chatbotId!: string;
  chatbot!: Chatbot;
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
      this.chatbotId = params['id'];

      this.chatbotAPI
        .getChatbot(this.chatbotId)
        .subscribe((result: Chatbot) => {
          this.chatbot = result;
          setTimeout(() => {
            this.drawOperators();
            this.flowchartService.changes.subscribe((newOperator) => {
              this.drawOperator(newOperator);
              let nextOperatorComp = this.operators.find(
                (o) =>
                  o.data.parentOperator == newOperator.parentOperator &&
                  o.data._id != newOperator._id
              );
              if (nextOperatorComp) {
                nextOperatorComp.data.parentOperator = newOperator._id;

                while (nextOperatorComp?.connection) {
                  if (nextOperatorComp && nextOperatorComp.connection) {
                    this.drawOperator(nextOperatorComp);
                  }
                  nextOperatorComp = this.operators.find(
                    (op) => op.data.parentOperator == nextOperatorComp?.data._id
                  );
                }
              }
            });
          });
        });
    });
  }

  ngAfterViewInit(): void {
    this.initPanZoom();
  }

  drawOperators() {
    this.operators.forEach((operator) => this.drawOperator(operator));
  }

  drawOperator(operator: OperatorComponent): void {
    console.count(operator.data.type + ' - ' + operator.data.script.content);
    console.trace();
    if (['option', 'trigger'].includes(operator.data.type)) {
      const choiceOp = this.operators.find(
        (o) => o.data._id == operator.data.parentOperator
      );
      (
        choiceOp?.operatorComp as ChoiceComponent | AssistantComponent
      ).updateTreePosition();
    } else {
      if (operator.connection) {
        this.flowchartService.instance.deleteConnection(operator.connection);
      }
      operator.calculatePosition();
      operator.connection = this.drawConnection(operator);
      this.flowchartService.instance.revalidate(operator.host.nativeElement);
    }
  }

  drawConnection(operator: OperatorComponent): Connection | null {
    if (
      operator.data.parentOperator &&
      operator.host.nativeElement.parentElement
    ) {
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

  addOperator(operator: Operator) {
    this.chatbot.operators.push(operator);
    if (!['option', 'trigger'].includes(operator.type)) {
      setTimeout(() => {
        let nextOperatorComp = this.operators.find(
          (o) =>
            o.data.parentOperator == operator.parentOperator &&
            o.data._id != operator._id
        );
        if (nextOperatorComp) {
          nextOperatorComp.data.parentOperator = operator._id;

          while (nextOperatorComp?.connection) {
            if (nextOperatorComp && nextOperatorComp.connection) {
              this.drawOperator(nextOperatorComp);
            }
            nextOperatorComp = this.operators.find(
              (op) => op.data.parentOperator == nextOperatorComp?.data._id
            );
          }
        }
      });
    }
  }

  onRemove(operator: Operator) {
    const index = this.chatbot.operators.indexOf(operator);
    if (index == -1) return;

    if (operator.type == 'choice' || operator.type == 'option') {
      this._deleteOperatorAndRelatives(operator);
    } else {
      this._updateNextOperator(operator);
      this.chatbot.operators.splice(index, 1);
    }
  }

  private _updateNextOperator(operator: Operator) {
    let nextOperatorComp = this.operators.find(
      (wid) => wid.data.parentOperator == operator._id
    );
    if (nextOperatorComp) {
      nextOperatorComp.data.parentOperator = operator.parentOperator;
      while (nextOperatorComp?.connection) {
        if (nextOperatorComp && nextOperatorComp.connection) {
          this.drawOperator(nextOperatorComp);
        }
        nextOperatorComp = this.operators.find(
          (op) => op.data.parentOperator == nextOperatorComp?.data._id
        );
      }
    }
  }

  private _deleteOperatorAndRelatives(operator: Operator) {
    const index = this.chatbot.operators.indexOf(operator);
    if (index !== -1) {
      const objID = this.chatbot.operators[index]._id;

      this.chatbot.operators.splice(index, 1);

      const children = this.chatbot.operators.filter(
        (obj) => obj.parentOperator === objID
      );
      children.forEach((child) => {
        this._deleteOperatorAndRelatives(child);
      });
    }
  }

  setZoom(value: number) {
    this.panzoomController.zoom(value);
    this.panzoomController.pan(0, 0);
  }

  initPanZoom() {
    this.panzoomController = Panzoom(this.container.nativeElement, {
      minScale: 0.5,
      maxScale: 2,
      contain: 'outside',
      excludeClass: 'operator',
      startX: -1100,
    });

    this.container.nativeElement.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        this.panzoomController.zoomWithWheel(event);
      }
    );
  }

  submit() {
    if (this.chatbotId) {
      this.chatbotAPI.putChatbot(this.chatbotId, this.chatbot).subscribe(() => {
        alert('Chatbot saved successfuly');
      });
    }
  }
}
