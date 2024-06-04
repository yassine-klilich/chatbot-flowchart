import { ChoiceOption } from '../../modules/flowchart/operator/choice/choice.component';

export interface OperatorScript {
  content: string;
  prompt?: string;
  validationAnswer?: string;
  variable?: string;
}
