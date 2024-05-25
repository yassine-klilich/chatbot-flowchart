import { OperatorScript } from './operator-script.model';

export interface Operator {
  _id?: string;
  type: OperatorType;
  title: string;
  script: OperatorScript;
  parentOperator?: string;
}

export type OperatorType = 'message' | 'collect' | 'api' | 'assistant' | 'end';
