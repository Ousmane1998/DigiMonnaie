import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulerTransactionComponent } from './annuler-transaction.component';

describe('AnnulerTransactionComponent', () => {
  let component: AnnulerTransactionComponent;
  let fixture: ComponentFixture<AnnulerTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnulerTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnulerTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
