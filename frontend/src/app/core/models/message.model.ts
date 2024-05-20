import { PromptMessage } from './prompt-message.model';

export interface Message {
  sentBy: 'bot' | 'user';
  message: string | PromptMessage;
}
