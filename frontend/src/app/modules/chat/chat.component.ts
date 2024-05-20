import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chatbot, Message } from '../../core/models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnChanges {
  @Input({ required: true }) chatbot!: Chatbot;

  textarea: string = '';
  messageLog: Message[] = [];
  conversationIndex: number = 0;

  ngOnChanges(): void {
    if (this.chatbot) {
      this.continueConversation();
    }
  }

  submitMessage(event: KeyboardEvent) {
    if (
      event.key == 'Enter' &&
      event.shiftKey == false &&
      this.textarea.trim().length > 0
    ) {
      this.messageLog.push({
        sentBy: 'user',
        message: this.textarea,
      });
      this.textarea = '';
      this.continueConversation();
    }
  }

  continueConversation() {
    for (
      let i = this.conversationIndex;
      i < this.chatbot.operators.length;
      i++
    ) {
      const operator = this.chatbot.operators[i];
      this.messageLog.push({
        sentBy: 'bot',
        message: operator.message.content,
      });
      ++this.conversationIndex;

      if (operator.type == 'collect') {
        break;
      }
    }
  }
}
