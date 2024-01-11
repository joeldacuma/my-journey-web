import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrowdsourcingComponent } from './crowdsourcing.component';

describe('CrowdsourcingComponent', () => {
  let component: CrowdsourcingComponent;
  let fixture: ComponentFixture<CrowdsourcingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrowdsourcingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrowdsourcingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
