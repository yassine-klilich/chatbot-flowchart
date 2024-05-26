import { Component, Input, input } from '@angular/core';
import { Operator } from '../../../../core/models';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-choice',
  standalone: true,
  imports: [FormsModule, NgIconComponent],
  templateUrl: './choice.component.html',
  styleUrl: './choice.component.css',
})
export class ChoiceComponent {
  @Input() data!: Operator;
  options: ChoiceOption[] = [
    {
      label: 'Banana',
      value: 'banana',
    },
    {
      label: 'Apple',
      value: 'apple',
    },
    {
      label: 'Watermelon',
      value: 'watermelon',
    },
  ];

  addOption() {
    this.options.push({
      label: 'Choice' + this.options.length,
      value: '',
    });
  }
}

export interface ChoiceOption {
  label: string;
  value: string;
}
