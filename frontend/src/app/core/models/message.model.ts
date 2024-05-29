import { OperatorScript } from './operator-script.model';
import { OperatorType } from './operator.model';

export interface Message {
  sentBy: 'bot' | 'user';
  message: string | OperatorScript;
  type: OperatorType | 'none';
  data?: any;
}
