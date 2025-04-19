import { Injectable } from '@angular/core';
import { TotalumApiSdk, AuthOptions } from 'totalum-api-sdk';

@Injectable({
  providedIn: 'root',
})
export class TotalumApiService {
  private totalumSdk: TotalumApiSdk;

  constructor() {
    const options: AuthOptions = {
      apiKey: {
        'api-key':
          'sk-eyJrZXkiOiIyOTRiNDdkYmI3ZDA4NzIwNDk4YzY5Y2MiLCJuYW1lIjoiRGVmYXVsdCBBUEkgS2V5IGF1dG9nZW5lcmF0ZWQgZ2R0cyIsIm9yZ2FuaXphdGlvbklkIjoianVhbnVjZWRhLXBydWViYS10ZWNuaWNhIn0_',
      },
    };
    this.totalumSdk = new TotalumApiSdk(options);
  }

  getSdk(): TotalumApiSdk {
    return this.totalumSdk;
  }
}
