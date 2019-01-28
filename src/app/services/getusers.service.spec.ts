import { TestBed } from '@angular/core/testing';

import { GetusersService } from './getusers.service';

describe('GetusersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetusersService = TestBed.get(GetusersService);
    expect(service).toBeTruthy();
  });
});
