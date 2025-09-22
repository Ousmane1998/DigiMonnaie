import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertComponent } from './transfert.component';

describe('TransfertComponent', () => {
  let component: TransfertComponent;
  let fixture: ComponentFixture<TransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
<<<<<<< HEAD
=======


>>>>>>> e325d82bec718a82e70079656995b427a6e402a3
