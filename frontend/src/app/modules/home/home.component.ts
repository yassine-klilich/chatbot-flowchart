import { Component, inject } from '@angular/core';
import { FlowchartService } from '../../services/flowchart.service';
import { NgIconComponent } from '@ng-icons/core';
import { Chat } from '../../services/chat-api.service';
import { RouterLink } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { NewFlowchartDialogComponent } from './new-flowchart-dialog/new-flowchart-dialog.component';

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

  deleteChat(chat: Chat) {
    if (confirm('Are you sure you want to delete this chat?')) {
      this.flowchartService.deleteChat(chat);
    }
  }

  _newChatDialog() {
    const dialogRef = this.dialog.open<string>(NewFlowchartDialogComponent, {
      width: '250px',
    });

    dialogRef.closed.subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
