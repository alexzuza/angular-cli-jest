import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable()
export class AuthenticationService {
  refresh() {
    return of('f');
  }
}
