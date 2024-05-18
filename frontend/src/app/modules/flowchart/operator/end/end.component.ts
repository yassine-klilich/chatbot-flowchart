import { Component, Input, inject } from '@angular/core';
import { OperatorComponent } from '../operator.component';
import { NgIconComponent } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { OperatorScript } from '../../../../core/models';

@Component({
  selector: 'app-end',
  standalone: true,
  imports: [NgIconComponent, FormsModule],
  templateUrl: './end.component.html',
  styleUrl: './end.component.css',
})
export class EndComponent {
  operatorComponent = inject(OperatorComponent);
  @Input() data!: OperatorScript;
}
