import { TestBed } from '@angular/core/testing';

import { TokenRefreshServiceTsService } from './token-refresh.service.ts.service';

describe('TokenRefreshServiceTsService', () => {
  let service: TokenRefreshServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenRefreshServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
