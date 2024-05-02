import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectDataComponent } from './collect-data.component';

describe('CollectDataComponent', () => {
  let component: CollectDataComponent;
  let fixture: ComponentFixture<CollectDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
