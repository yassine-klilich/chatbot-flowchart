import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Operator } from '../../../../../core/models';

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './option.component.html',
  styleUrl: './option.component.css',
})
export class OptionComponent {
  @Input() data!: Operator;
}
