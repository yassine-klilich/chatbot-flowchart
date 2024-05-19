import { Component, Input } from '@angular/core';
import { Chatbot } from '../../core/models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  @Input({ required: true }) chatbot!: Chatbot;
}
