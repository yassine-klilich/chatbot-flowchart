import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotApiService } from '../../../services/chatbot-api.service';
import { Router } from '@angular/router';
import { Chatbot } from '../../../core/models';

@Component({
  selector: 'app-new-chatbot-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-chatbot-dialog.component.html',
  styleUrl: './new-chatbot-dialog.component.css',
})
export class NewChatbotDialogComponent {
  router = inject(Router);
  dialogRef = inject(DialogRef<string>);
  chatbotAPI = inject(ChatbotApiService);

  name: string = '';

  constructor() {}

  onSubmit() {
    if (!this.name) {
      alert('Name is required to create a new chatbot.');
      return;
    }
    this.dialogRef.close();
    this.chatbotAPI
      .postChatbot({
        name: this.name,
        operators: [],
      })
      .subscribe((newChatbot: Chatbot) => {
        this.router.navigate(['flowchart', newChatbot._id]);
      });
  }
}
