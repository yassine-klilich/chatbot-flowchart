import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chatbot, Message, OpenAIMessage } from '../../core/models';
import { ChatbotApiService } from '../../services/chatbot-api.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  chatbotAPI = inject(ChatbotApiService);

  chatbotId = input<string>();
  chatbot!: Chatbot;

  textarea: string = '';
  messageLog: Message[] = [];
  conversationIndex: number = 0;
  conversationHistory: OpenAIMessage[] = [];
  endConversation: boolean = false;
  variables: Map<string, string> = new Map();
  isBotTyping: boolean = false;
  chatFlow: any;
  currentOperator: any;

  ngOnInit(): void {
    const _id = this.chatbotId();
    if (_id) {
      this.chatbotAPI.getChatbot(_id).subscribe((result: Chatbot) => {
        this.chatbot = result;
        this.chatFlow = this.buildChatFlow();
        this.currentOperator = this.chatFlow;

        // this.startingPoint = this.chatFlow
        this.continueConversation();
      });
    }
  }

  buildChatFlow() {
    const map = new Map();
    let root = null;

    this.chatbot.operators.forEach((item) => {
      map.set(item._id, { ...item, children: [] });
    });

    this.chatbot.operators.forEach((item) => {
      if (item.parentOperator != null) {
        const parent = map.get(item.parentOperator);
        if (parent) {
          parent.children.push(map.get(item._id));
        }
      } else {
        root = map.get(item._id);
      }
    });

    return root;
  }

  submitMessage(event: KeyboardEvent): void {
    if (this.isMessageSubmissionValid(event)) {
      this.addUserMessage();
      if (this.currentOperator.type === 'choice') {
        this.handleChoiceOperator();
      } else {
        this.handleNonChoiceOperator();
      }
      this.textarea = '';
    }
  }

  private isMessageSubmissionValid(event: KeyboardEvent): boolean {
    return (
      !this.endConversation &&
      event.key === 'Enter' &&
      event.ctrlKey &&
      this.textarea.trim().length > 0
    );
  }

  private addUserMessage(): void {
    this.messageLog.push({
      sentBy: 'user',
      message: this.textarea.trim(),
      type: 'none',
    });
  }

  private handleChoiceOperator(): void {
    const option = this._getOption();
    if (!option) {
      this.messageLog.push({
        sentBy: 'bot',
        message: 'Invalid option.\n Please click one of the options above.',
        type: 'none',
      });
    } else {
      this.currentOperator = option;
      this.continueConversation();
    }
  }

  private handleNonChoiceOperator(): void {
    const lastStoppedOperator = this.currentOperator;
    if (lastStoppedOperator.type === 'collect') {
      this.processCollectOperator(lastStoppedOperator);
    }
  }

  private processCollectOperator(lastStoppedOperator: any): void {
    this.conversationHistory = [
      {
        role: 'system',
        content: 'You are a helpful context checker tool.',
      },
      {
        role: 'system',
        content: `Read the 'question' field from the JSON object and evaluate the 'answer' property if it is correct contextually with the question. Return a JSON object with one field: 'valid' (a boolean indicating whether the context of the 'answer' is appropriate given the context of the 'question').`,
      },
      {
        role: 'user',
        content: JSON.stringify({
          question: lastStoppedOperator.script.content,
          answer: this.messageLog[this.messageLog.length - 1].message,
        }),
      },
    ];

    this.isBotTyping = true;
    this.chatbotAPI
      .evaluateMessage(this.conversationHistory)
      .subscribe((response) => {
        this.isBotTyping = false;
        this.handleEvaluationResponse(response, lastStoppedOperator);
      });
  }

  private handleEvaluationResponse(
    response: any,
    lastStoppedOperator: any
  ): void {
    if (response.valid) {
      this.updateVariable(lastStoppedOperator);
      this.nextOperator();
      this.continueConversation();
    } else {
      this.messageLog.push({
        sentBy: 'bot',
        message: lastStoppedOperator.script.validationAnswer || '',
        type: lastStoppedOperator.type,
      });
    }
  }

  private updateVariable(operator: any): void {
    if (
      operator.script.variable &&
      this.variables.has(operator.script.variable)
    ) {
      this.variables.set(
        operator.script.variable,
        this.messageLog[this.messageLog.length - 1].message as string
      );
    }
  }

  _getOption(): any {
    return this.currentOperator.children.find(
      (o: any) => o.script.content == this.textarea.trim()
    );
  }

  nextOperator() {
    this.currentOperator = this.currentOperator.children[0];
    if (this.currentOperator == null) {
      this.endConversation = true;
    }
  }

  continueConversation() {
    while (this.currentOperator != null) {
      if (this.currentOperator.type == 'choice') {
        this.messageLog.push({
          sentBy: 'bot',
          message: this.setVariables(this.currentOperator.script.content),
          type: this.currentOperator.type,
          data: { options: this.currentOperator.children },
        });
        break;
      }
      if (this.currentOperator.type != 'option') {
        this.messageLog.push({
          sentBy: 'bot',
          message: this.setVariables(this.currentOperator.script.content),
          type: this.currentOperator.type,
        });
      }
      if (this.currentOperator.type == 'end') {
        this.endConversation = true;
        break;
      }
      if (this.currentOperator.type == 'collect') {
        if (this.currentOperator.script.variable) {
          this.variables.set(this.currentOperator.script.variable, '');
        }
        break;
      }
      this.nextOperator();
      console.log('loooop');
    }
  }

  setVariables(content: string): string {
    const regex = /\{\{(.+?)\}\}/g;

    return content.replace(regex, (match, key) => {
      key = key.trim();
      const varOperator = this.variables.get(key);
      if (varOperator) {
        return varOperator;
      }
      return match;
    });
  }

  optionClicked(option: any) {
    if (!this.endConversation) {
      this.currentOperator = option;
      this.messageLog.push({
        sentBy: 'user',
        message: this.currentOperator.script.content,
        type: this.currentOperator.type,
      });
      this.continueConversation();
    }
  }
}
