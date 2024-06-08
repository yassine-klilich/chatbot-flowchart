import { OperatorScript } from './operator-script.model';
import { OperatorType } from './operator.model';

export interface Message {
  sentBy: 'bot' | 'user';
  message: string;
  type: OperatorType | 'none';
  data?: any;
}
