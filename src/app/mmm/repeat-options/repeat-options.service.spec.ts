import { TestBed } from '@angular/core/testing';

import { RepeatOptionsService } from './repeat-options.service';

describe('RepeatOptionsService', () => {
  let service: RepeatOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepeatOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
