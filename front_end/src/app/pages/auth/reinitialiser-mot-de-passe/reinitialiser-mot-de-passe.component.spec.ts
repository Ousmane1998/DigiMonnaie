import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinitialiserMotDePasseComponent } from './reinitialiser-mot-de-passe.component';

describe('ReinitialiserMotDePasseComponent', () => {
  let component: ReinitialiserMotDePasseComponent;
  let fixture: ComponentFixture<ReinitialiserMotDePasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReinitialiserMotDePasseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReinitialiserMotDePasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
