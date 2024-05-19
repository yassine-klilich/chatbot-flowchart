import { Operator } from './operator.model';

export interface Chatbot {
  _id?: string;
  name: string;
  operators: Operator[];
}
