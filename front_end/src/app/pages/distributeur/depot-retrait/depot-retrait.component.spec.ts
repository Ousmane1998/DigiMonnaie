import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotRetraitComponent } from './depot-retrait.component';

describe('DepotRetraitComponent', () => {
  let component: DepotRetraitComponent;
  let fixture: ComponentFixture<DepotRetraitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotRetraitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotRetraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
