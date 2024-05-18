import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-chatbot-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-chatbot-dialog.component.html',
  styleUrl: './new-chatbot-dialog.component.css'
})
export class NewChatbotDialogComponent {
  name: string = '';

  constructor(
    public dialogRef: DialogRef<string>
  ) {}

  onSubmit() {
    if (!this.name) {
      alert('Name is required to create a new chatbot.')
      return
    }

  }
}
