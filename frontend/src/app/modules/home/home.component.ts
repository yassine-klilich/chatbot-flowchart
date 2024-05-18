import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { FlowchartService } from '../../services/flowchart.service';
import { NewChatbotDialogComponent } from './new-flowchart-dialog/new-chatbot-dialog.component';
import { Chatbot } from '../../core/models';
import { ChatbotApiService } from '../../services/chatbot-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIconComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  flowchartService = inject(FlowchartService);
  dialog = inject(Dialog);
  chatbotAPI = inject(ChatbotApiService);

  ngOnInit(): void {
    this.chatbotAPI.getChatbots().subscribe((result) => {
      this.flowchartService.chats = result;
    });
  }

  deleteChat(chat: Chatbot) {
    if (confirm('Are you sure you want to delete this chat?')) {
      this.flowchartService.deleteChat(chat);
    }
  }

  _newChatDialog() {
    this.dialog.open<string>(NewChatbotDialogComponent, {
      width: '250px',
    });
  }
}
