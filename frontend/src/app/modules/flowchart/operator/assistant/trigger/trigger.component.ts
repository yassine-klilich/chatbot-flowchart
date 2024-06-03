import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Operator } from '../../../../../core/models';

@Component({
  selector: 'app-trigger',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './trigger.component.html',
  styleUrl: './trigger.component.css',
})
export class TriggerComponent {
  @Input() data!: Operator;
}
