import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chatbot } from '../../core/models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnChanges {
  @Input({ required: true }) chatbot!: Chatbot;

  textarea: string = '';
  messageLog: Message[] = [];

  ngOnChanges(): void {
    this.chatbot &&
      this.chatbot.operators.forEach((operator) => {
        switch (operator.type) {
          case 'message':
            {
              this.messageLog.push({
                sentBy: 'bot',
                message: operator.message.content,
              });
            }
            break;

          case 'collect':
            {
              this.messageLog.push({
                sentBy: 'bot',
                message: operator.message.content,
              });
            }
            break;

          case 'end':
            {
              this.messageLog.push({
                sentBy: 'bot',
                message: operator.message.content,
              });
            }
            break;
        }
      });
  }

  submitMessage(event: KeyboardEvent) {
    if (event.key == 'Enter' && event.ctrlKey == true) {
      this.messageLog.push({
        sentBy: 'user',
        message: this.textarea,
      });
      this.textarea = '';
    }
  }
}

export interface Message {
  sentBy: 'bot' | 'user';
  message: string | PromptMessage;
}

export interface PromptMessage {
  content: string;
  prompt?: string;
  validationAnswer?: string;
}
