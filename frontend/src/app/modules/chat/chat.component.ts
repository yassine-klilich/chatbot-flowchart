import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, inject } from '@angular/core';
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
export class ChatComponent implements OnChanges {
  apiChat = inject(ChatbotApiService);

  @Input({ required: true }) chatbot!: Chatbot;

  textarea: string = '';
  messageLog: Message[] = [];
  conversationIndex: number = 0;
  conversationHistory: OpenAIMessage[] = [];
  endConversation: boolean = false;

  ngOnChanges(): void {
    if (this.chatbot) {
      this.continueConversation();
    }
  }

  submitMessage(event: KeyboardEvent) {
    if (
      !this.endConversation &&
      event.key == 'Enter' &&
      event.ctrlKey == true &&
      this.textarea.trim().length > 0
    ) {
      this.messageLog.push({
        sentBy: 'user',
        message: this.textarea.trim(),
      });
      this.textarea = '';
      const lastStopedOperator =
        this.chatbot.operators[this.conversationIndex - 1];
      if (lastStopedOperator.type == 'collect') {
        this.conversationHistory = [];
        this.conversationHistory.push(
          {
            role: 'system',
            content: `You are a helpful context checker tool.`,
          },
          {
            role: 'system',
            content: `Read the 'question' field from the JSON object and evaluate the 'answer' property if it is correct contextually with the question. Return a JSON object with one fields: 'valid' (a boolean indicating whether the context of the 'answer' is appropriate given the context of the 'question').`,
          },
          {
            role: 'user',
            content: JSON.stringify({
              question: lastStopedOperator.message.content,
              answer: this.messageLog[this.messageLog.length - 1],
            }),
          }
        );

        this.apiChat
          .evaluateMessage(this.conversationHistory)
          .subscribe((response) => {
            if (response.valid == true) {
              this.continueConversation();
            } else {
              this.messageLog.push({
                sentBy: 'bot',
                message: lastStopedOperator.message.validationAnswer || '',
              });
            }
          });
      }
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

      if (operator.type == 'end') {
        this.endConversation = true;
        break;
      }
      if (operator.type == 'collect') {
        break;
      }
    }
  }
}
