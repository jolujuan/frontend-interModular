import { TestBed } from '@angular/core/testing';

import { ShowPopUpServiceService } from './show-pop-up-service.service';

describe('ShowPopUpServiceService', () => {
  let service: ShowPopUpServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowPopUpServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
