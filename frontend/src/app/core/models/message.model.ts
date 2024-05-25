import { OperatorScript } from './operator-script.model';

export interface Message {
  sentBy: 'bot' | 'user';
  message: string | OperatorScript;
}
