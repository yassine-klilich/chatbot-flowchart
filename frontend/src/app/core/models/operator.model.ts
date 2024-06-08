import { OperatorScript } from './operator-script.model';

export interface Operator {
  _id?: string;
  type: OperatorType;
  title: string;
  script: OperatorScript;
  parentOperator?: string;
  smartTrigger?: string;
}

export interface ChatOperator {
  _id?: string;
  type: OperatorType;
  title: string;
  script: OperatorScript;
  parentOperator?: string;
  children: ChatOperator[];
}

export type OperatorType =
  | 'message'
  | 'collect'
  | 'choice'
  | 'option'
  | 'api'
  | 'assistant'
  | 'trigger'
  | 'end';
