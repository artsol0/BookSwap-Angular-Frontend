import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookLocationHistoryComponent } from './book-location-history.component';

describe('BookLocationHistoryComponent', () => {
  let component: BookLocationHistoryComponent;
  let fixture: ComponentFixture<BookLocationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookLocationHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookLocationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
