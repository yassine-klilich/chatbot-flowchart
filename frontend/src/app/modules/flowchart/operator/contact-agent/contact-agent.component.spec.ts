import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAgentComponent } from './contact-agent.component';

describe('ContactAgentComponent', () => {
  let component: ContactAgentComponent;
  let fixture: ComponentFixture<ContactAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactAgentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
