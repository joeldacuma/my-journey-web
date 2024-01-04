import { TestBed } from '@angular/core/testing';

import { httpInterceptorService } from './httpInterceptor.service';

describe('InterceptorService', () => {
  let service: httpInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(httpInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
