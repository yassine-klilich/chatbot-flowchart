import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { OperatorScript } from '../../../../services/flowchart.service';
import { FlowchartMenuComponent } from '../../flowchart-menu/flowchart-menu.component';
import { OperatorComponent } from '../operator.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgIconComponent, FormsModule, FlowchartMenuComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  operatorComponent = inject(OperatorComponent);
  @Input() data!: OperatorScript;
}
