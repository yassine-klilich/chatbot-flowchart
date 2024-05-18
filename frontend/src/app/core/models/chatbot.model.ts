import { OperatorScript } from "./operator.model";

export interface Chatbot {
  _id?: string;
  name: string;
  operators: OperatorScript[];
}
