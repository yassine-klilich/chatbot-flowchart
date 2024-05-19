import { PromptMessage } from '../../modules/chat/chat.component';

export interface Operator {
  _id?: string;
  type: OperatorType;
  title: string;
  message: PromptMessage;
  parentOperator?: string;
}

export type OperatorType = 'message' | 'collect' | 'api' | 'assistant' | 'end';
