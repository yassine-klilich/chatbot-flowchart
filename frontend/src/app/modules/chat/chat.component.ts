import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ChatOperator,
  Chatbot,
  Message,
  OpenAIMessage,
} from '../../core/models';
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
  chatFlow?: ChatOperator;
  currentOperator?: ChatOperator;

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

  buildChatFlow(): ChatOperator | undefined {
    const map = new Map();
    let root: ChatOperator | undefined;

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
      if (this.currentOperator?.type === 'choice') {
        this.handleChoiceOperator();
      }
      if (this.currentOperator?.type === 'assistant') {
        this.handleAssistantOperator();
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

  private handleAssistantOperator(): void {
    const triggers = this.currentOperator?.children.map((trigger) => ({
      id: trigger._id,
      content: trigger.script.content,
    }));
    if (triggers && triggers.length > 0) {
      const data: OpenAIMessage[] = [
        {
          role: 'system',
          content: 'You are a helpful context checker tool.',
        },
        {
          role: 'system',
          content: `Read the 'message' field from the provided JSON object. Based on the content of the 'message', identify and select the most appropriate option from the 'options' field. Each option is represented as a JSON object with 'id' and 'content' fields. Return a JSON object containing a single field named 'triggerID', which should correspond to the 'id' of the matched option. If none of the options matches, return the 'triggerID' with empty string.`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            message: this.textarea,
            options: triggers,
          }),
        },
      ];

      this.isBotTyping = true;
      this.chatbotAPI.evaluateMessage(data).subscribe((response) => {
        this.isBotTyping = false;
        const trigger = this.currentOperator?.children.find(
          (t) => t._id == response.triggerID
        );
        if (trigger) {
          this.currentOperator = trigger;
          this.continueConversation();
        } else {
          this.messageLog.push({
            sentBy: 'bot',
            message: this.currentOperator?.script.validationAnswer || '',
            type: 'none',
          });
        }
      });
    }
  }

  private handleNonChoiceOperator(): void {
    if (this.currentOperator?.type === 'collect') {
      this.processCollectOperator();
    }
  }

  private processCollectOperator(): void {
    const prompt = this.currentOperator?.script.prompt?.trim();
    if (prompt != null && prompt != '') {
      this.conversationHistory = [
        {
          role: 'system',
          content: `Validate the 'message' field from the JSON object using the 'prompt' field. Return the result in a JSON object with one field named 'valid' (a boolean indicating whether the message is valid or not).`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            prompt: this.currentOperator?.script.prompt,
            message: this.messageLog[this.messageLog.length - 1].message,
          }),
        },
      ];

      this.isBotTyping = true;
      this.chatbotAPI
        .evaluateMessage(this.conversationHistory)
        .subscribe((response) => {
          this.isBotTyping = false;
          this.handleEvaluationResponse(response, this.currentOperator);
        });
    } else {
      this.updateVariable(this.currentOperator);
      this.nextOperator();
      this.continueConversation();
    }
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
    return this.currentOperator?.children.find(
      (o: any) => o.script.content == this.textarea.trim()
    );
  }

  nextOperator() {
    this.currentOperator = this.currentOperator?.children[0];
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
      if (this.currentOperator.type == 'assistant') {
        this.messageLog.push({
          sentBy: 'bot',
          message: this.setVariables(this.currentOperator.script.content),
          type: this.currentOperator.type,
          data: { triggers: this.currentOperator.children },
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
        message: this.currentOperator?.script.content || '',
        type: this.currentOperator?.type || 'none',
      });
      this.continueConversation();
    }
  }
}
