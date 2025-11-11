import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiAdminComponent } from './fi-admin.component';

describe('FiAdminComponent', () => {
  let component: FiAdminComponent;
  let fixture: ComponentFixture<FiAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiAdminComponent]
    });
    fixture = TestBed.createComponent(FiAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
