import { Component, Input } from '@angular/core';
import { Operator } from '../../../../core/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-agent',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-agent.component.html',
  styleUrl: './contact-agent.component.css',
})
export class ContactAgentComponent {
  @Input() data!: Operator;
}
