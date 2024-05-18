import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { Chatbot } from '../../services/chatbot-api.service';
import { FlowchartService } from '../../services/flowchart.service';
import { NewChatbotDialogComponent } from './new-flowchart-dialog/new-chatbot-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIconComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  flowchartService = inject(FlowchartService);
  dialog = inject(Dialog)

  deleteChat(chat: Chatbot) {
    if (confirm('Are you sure you want to delete this chat?')) {
      this.flowchartService.deleteChat(chat);
    }
  }

  _newChatDialog() {
    const dialogRef = this.dialog.open<string>(NewChatbotDialogComponent, {
      width: '250px',
    });

    dialogRef.closed.subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
