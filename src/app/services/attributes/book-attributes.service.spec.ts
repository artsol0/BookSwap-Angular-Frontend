import { TestBed } from '@angular/core/testing';

import { BookAttributesService } from './book-attributes.service';

describe('BookAttributesService', () => {
  let service: BookAttributesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookAttributesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
