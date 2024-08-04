import { Injectable } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { Subject } from 'rxjs';
import { Chatbot, OperatorType } from '../core/models';
import { OperatorComponent } from '../modules/flowchart/operator/operator.component';

@Injectable({
  providedIn: 'root',
})
export class FlowchartService {
  chats: Chatbot[] = [];
  variables: Map<string, OperatorComponent> = new Map();

  instance!: BrowserJsPlumbInstance;
  changes: Subject<any> = new Subject();
  remove: Subject<any> = new Subject();
  readonly operatorTypes: Record<OperatorType, OperatorType[]> = {
    message: ['message', 'collect', 'choice', 'assistant', 'go-to', 'end'],
    collect: ['message', 'collect', 'choice', 'assistant', 'go-to', 'end'],
    choice: [],
    option: ['message', 'collect', 'choice', 'assistant', 'go-to', 'end'],
    api: [],
    assistant: [],
    trigger: ['message', 'collect', 'choice', 'assistant', 'go-to', 'end'],
    'go-to': [],
    end: [],
  };

  deleteChat(chat: Chatbot) {
    const index = this.chats.indexOf(chat);
    if (index > -1) {
      this.chats.splice(index, 1);
    }
  }

  appendVariable(variable: string, operator: OperatorComponent): boolean {
    if (!/^[a-zA-Z_-]+$/.test(variable)) {
      alert(
        `Invalid variable name.\n Variable must contain only alphabets, dashes or underscores.`
      );
      return false;
    }
    const varOperator = this.variables.get(variable);
    if (varOperator && varOperator != operator) {
      alert(`Variable '${variable}' already exists.`);
      return false;
    }
    if (varOperator) {
      return false;
    }
    this.variables.set(variable, operator);
    return true;
  }

  removeVariable(variable: string | undefined) {
    variable && this.variables.delete(variable);
  }
}
