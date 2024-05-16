import { Component, inject } from '@angular/core';
import { FlowchartService } from '../../services/flowchart.service';
import { NgIconComponent } from '@ng-icons/core';
import { Chat } from '../../services/chat-api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIconComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  flowchartService = inject(FlowchartService);

  deleteChat(chat: Chat) {
    if (confirm('Are you sure you want to delete this chat?')) {
      this.flowchartService.deleteChat(chat);
    }
  }
}
