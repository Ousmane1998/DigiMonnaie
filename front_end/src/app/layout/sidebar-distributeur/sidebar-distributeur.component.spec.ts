import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDistributeurComponent } from './sidebar-distributeur.component';

describe('SidebarDistributeurComponent', () => {
  let component: SidebarDistributeurComponent;
  let fixture: ComponentFixture<SidebarDistributeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarDistributeurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarDistributeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
