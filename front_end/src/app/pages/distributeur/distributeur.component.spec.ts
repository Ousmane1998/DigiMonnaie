import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeurComponent } from './distributeur.component';

describe('DistributeurComponent', () => {
  let component: DistributeurComponent;
  let fixture: ComponentFixture<DistributeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributeurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistributeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
