import { Component, Inject } from '@angular/core';
import {Dialog, DialogRef, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-flowchart-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-flowchart-dialog.component.html',
  styleUrl: './new-flowchart-dialog.component.css'
})
export class NewFlowchartDialogComponent {
  name!: string;

  constructor(
    public dialogRef: DialogRef<string>
  ) {}

  onSubmit() {
    console.log(this.name);

  }
}
