import { TestBed } from '@angular/core/testing';

import { UserprofilesService } from './userprofiles.service';

describe('UserprofilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserprofilesService = TestBed.get(UserprofilesService);
    expect(service).toBeTruthy();
  });
});
