import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFlowchartDialogComponent } from './new-flowchart-dialog.component';

describe('NewFlowchartDialogComponent', () => {
  let component: NewFlowchartDialogComponent;
  let fixture: ComponentFixture<NewFlowchartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFlowchartDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewFlowchartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
