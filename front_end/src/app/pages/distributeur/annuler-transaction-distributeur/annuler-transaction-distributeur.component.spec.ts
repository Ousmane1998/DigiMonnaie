import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulerTransactionDistributeurComponent } from './annuler-transaction-distributeur.component';

describe('AnnulerTransactionDistributeurComponent', () => {
  let component: AnnulerTransactionDistributeurComponent;
  let fixture: ComponentFixture<AnnulerTransactionDistributeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnulerTransactionDistributeurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnulerTransactionDistributeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
