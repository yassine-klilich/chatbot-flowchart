import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowchartMenuComponent } from './flowchart-menu.component';

describe('FlowchartMenuComponent', () => {
  let component: FlowchartMenuComponent;
  let fixture: ComponentFixture<FlowchartMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowchartMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlowchartMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
