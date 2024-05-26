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

  ngOnInit(): void {
    const _id = this.chatbotId();
    if (_id) {
      this.chatbotAPI.getChatbot(_id).subscribe((result: Chatbot) => {
        this.chatbot = result;
        this.continueConversation();
      });
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
              question: lastStopedOperator.script.content,
              answer: this.messageLog[this.messageLog.length - 1].message,
            }),
          }
        );

        this.isBotTyping = true;
        this.chatbotAPI
          .evaluateMessage(this.conversationHistory)
          .subscribe((response) => {
            this.isBotTyping = false;
            if (response.valid == true) {
              if (
                lastStopedOperator.script.variable &&
                this.variables.has(lastStopedOperator.script.variable)
              ) {
                this.variables.set(
                  lastStopedOperator.script.variable,
                  this.messageLog[this.messageLog.length - 1].message as string
                );
              }
              this.continueConversation();
            } else {
              this.messageLog.push({
                sentBy: 'bot',
                message: lastStopedOperator.script.validationAnswer || '',
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
        message: this.setVariables(operator.script.content),
      });
      ++this.conversationIndex;

      if (operator.type == 'end') {
        this.endConversation = true;
        break;
      }
      if (operator.type == 'collect') {
        if (operator.script.variable) {
          this.variables.set(operator.script.variable, '');
        }
        break;
      }
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
}
