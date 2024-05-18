export interface OperatorScript {
  _id?: string;
  type: OperatorType;
  title: string;
  data: {
    content: string;
    prompt?: string;
    validationAnswer?: string;
  };
  parentOperator?: string;
}

export type OperatorType = 'message' | 'collect' | 'api' | 'assistant' | 'end';
