import { TestBed } from '@angular/core/testing';

import { GaussSeidilService } from './gauss-seidil.service';

describe('GaussSeidilService', () => {
  let service: GaussSeidilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GaussSeidilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
