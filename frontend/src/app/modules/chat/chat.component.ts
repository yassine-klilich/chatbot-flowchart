import { Component, Input } from '@angular/core';
import { Chatbot, Operator } from '../../core/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  @Input({ required: true }) chatbot!: Chatbot;

  textarea: string = '';
  messageLog: Message[] = [];

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
  message: string | Operator;
}
