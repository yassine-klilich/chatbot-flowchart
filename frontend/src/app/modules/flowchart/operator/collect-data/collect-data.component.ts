import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { FlowchartMenuComponent } from '../../flowchart-menu/flowchart-menu.component';
import { OperatorComponent } from '../operator.component';
import { OperatorScript } from '../../../../core/models';

@Component({
  selector: 'app-collect-data',
  standalone: true,
  imports: [NgIconComponent, FormsModule, FlowchartMenuComponent],
  templateUrl: './collect-data.component.html',
  styleUrl: './collect-data.component.css',
})
export class CollectDataComponent {
  operatorComponent = inject(OperatorComponent);
  @Input() data!: OperatorScript;
}
