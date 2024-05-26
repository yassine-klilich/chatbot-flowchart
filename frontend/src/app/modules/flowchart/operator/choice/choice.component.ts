import { Component, Input, OnInit, input } from '@angular/core';
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
export class ChoiceComponent implements OnInit {
  @Input() data!: Operator;

  ngOnInit(): void {
    if (!this.data.script.options) {
      this.data.script.options = [];
    }
  }

  addOption() {
    this.data.script.options?.push({
      label: 'Choice ' + this.data.script.options.length,
      value: '',
    });
  }

  deleteOption(option: ChoiceOption) {
    if (this.data.script.options) {
      const index = this.data.script.options?.indexOf(option);
      if (index > -1) {
        this.data.script.options.splice(index, 1);
      }
    }
  }
}

export interface ChoiceOption {
  label: string;
  value: string;
}
