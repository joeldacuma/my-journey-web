import { TestBed } from '@angular/core/testing';

import { DispatcherDataService } from './dispatcher-data.service';

describe('DispatcherDataService', () => {
  let service: DispatcherDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatcherDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
