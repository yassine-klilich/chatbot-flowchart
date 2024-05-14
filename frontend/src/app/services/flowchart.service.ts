import { Injectable } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlowchartService {
  operators: OperatorScript[] = [
    {
      _id: '100',
      type: 'message',
      title: 'Welcome',
      data: {
        content: 'Hello there, how can I help you ?',
      },
      position: {
        top: 48,
        left: 188,
      },
    },
    // {
    //   id: 200,
    //   type: 'collect',
    //   content: 'Hello there, how can I help you ?',
    //   position: {
    //     top: 250,
    //     left: 188,
    //   },
    //   parentOperator: 100,
    // },
  ];
  instance!: BrowserJsPlumbInstance;
  changes: Subject<any> = new Subject();
  remove: Subject<any> = new Subject();
  readonly operatorTypes: Record<OperatorType, OperatorType[]> = {
    message: ['message', 'collect', 'end'],
    collect: ['message', 'collect', 'end'],
    api: [],
    assistant: [],
    end: [],
  };

  addOperator(operator: OperatorScript) {
    this.operators.push(operator);
  }

  removeOperator(operator: OperatorScript) {
    const index = this.operators.indexOf(operator);
    if (index > -1) {
      if (operator.parentOperator) {
        this.operators.forEach((i) => {
          if (i.parentOperator == operator._id) {
            i.parentOperator = operator.parentOperator;
          }
        });
      }
      this.operators.splice(index, 1);
    }
  }
}

export interface OperatorScript {
  _id?: string;
  type: OperatorType;
  title: string;
  data: {
    content: string;
    prompt?: string;
    validationAnswer?: string;
  };
  position: {
    top: number;
    left: number;
  };
  parentOperator?: number;
}

export type OperatorType = 'message' | 'collect' | 'api' | 'assistant' | 'end';
