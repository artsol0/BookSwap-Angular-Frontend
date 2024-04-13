import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordFromComponent } from './reset-password-from.component';

describe('ResetPasswordFromComponent', () => {
  let component: ResetPasswordFromComponent;
  let fixture: ComponentFixture<ResetPasswordFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordFromComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResetPasswordFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
