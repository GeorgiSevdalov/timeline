import { TestBed } from '@angular/core/testing';

import { CheckEndService } from './check-end.service';

describe('CheckEndService', () => {
  let service: CheckEndService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckEndService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
