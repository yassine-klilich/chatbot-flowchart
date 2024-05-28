import { ChoiceOption } from '../../modules/flowchart/operator/choice/choice.component';

export interface OperatorScript {
  content: string;
  validationAnswer?: string;
  variable?: string;
}
