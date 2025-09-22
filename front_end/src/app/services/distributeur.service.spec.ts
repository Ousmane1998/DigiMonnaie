import { TestBed } from '@angular/core/testing';

import { DistributeurService } from './distributeur.service';

describe('DistributeurService', () => {
  let service: DistributeurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributeurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
