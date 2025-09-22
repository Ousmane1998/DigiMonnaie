import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonQrcodeComponent } from './mon-qrcode.component';

describe('MonQrcodeComponent', () => {
  let component: MonQrcodeComponent;
  let fixture: ComponentFixture<MonQrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonQrcodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
