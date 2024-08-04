import { Component, inject, Input } from '@angular/core';
import { Operator } from '../../../../core/models';
import { OperatorComponent } from '../operator.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-go-to',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './go-to.component.html',
  styleUrl: './go-to.component.css',
})
export class GoToComponent {
  operatorComponent = inject(OperatorComponent);
  @Input() data!: Operator;

  optionsOperators: any[] = [];

  ngOnInit() {}

  ngAfterViewInit() {
    this.operatorComponent.flowchartComponent.operators.changes.subscribe(
      () => {
        setTimeout(() => {
          this.optionsOperators =
            this.operatorComponent.flowchartComponent.operators
              .map((op) => ({
                _id: op.data._id,
                label: op.data.title,
              }))
              .filter((op) => op.label != undefined && op.label != '');
        });
      }
    );
  }
}
