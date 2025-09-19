import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueDistributeurComponent } from './historique-distributeur.component';

describe('HistoriqueDistributeurComponent', () => {
  let component: HistoriqueDistributeurComponent;
  let fixture: ComponentFixture<HistoriqueDistributeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueDistributeurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriqueDistributeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
