import { TestBed } from '@angular/core/testing';

import { DefaultOptionsService } from './default-options.service';

describe('DefaultOptionsService', () => {
  let service: DefaultOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
