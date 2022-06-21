import { TestBed } from '@angular/core/testing';

import { CloudNotificationService } from './cloud-notification.service';

describe('CloudNotificationService', () => {
  let service: CloudNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
