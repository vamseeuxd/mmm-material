import { TestBed } from '@angular/core/testing';

import { SettledTransactionsService } from './settled-transactions.service';

describe('SettledTransactionsService', () => {
  let service: SettledTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettledTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
