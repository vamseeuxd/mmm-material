import { TestBed } from '@angular/core/testing';

import { TaxExemptionsService } from './tax-exemptions.service';

describe('TaxExemptionsService', () => {
  let service: TaxExemptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxExemptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
