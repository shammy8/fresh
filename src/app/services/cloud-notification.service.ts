import { Injectable } from '@angular/core';

import {
  getToken,
  MessagePayload,
  Messaging,
  onMessage,
} from '@angular/fire/messaging';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable()
export class CloudNotificationService {
  cloudMessage$: Observable<MessagePayload> = new Observable((sub) =>
    onMessage(this._fcm, (payload) => sub.next(payload))
  );

  token: string | null = null;

  constructor(private _fcm: Messaging) {
    this._registerSWAndGetToken();
  }

  // TODO only Chrome seems to work
  // after accepting the receive notification alert from the browser
  private async _registerSWAndGetToken() {
    // I think this requests permission too
    const serviceWorkerRegistration = await navigator.serviceWorker.register(
      'firebase-messaging-sw.js',
      { type: 'module', scope: '__' }
    );
    this.token = await getToken(this._fcm, {
      serviceWorkerRegistration,
      vapidKey: environment.vapidKey,
    });
    console.log(this.token);
  }
}
