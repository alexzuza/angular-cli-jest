import { mergeMap, mergeScan, retryWhen, share } from 'rxjs/operators';
import { defer, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';

@Injectable()
export class RefreshableHttpService {
  private tokenObservable = defer(() => {
    return this.authenticationService.refresh();
  }).pipe(share());

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {

  }
  public post<T extends Response | boolean | string | Array<T> | Object>(
    url: string,
    body: any,
    options?: {
      type?: { new (): Response };
      overrideEndpoint?: string;
      headers?: { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
    }
  ): Observable<T> {
    return defer<T>(() => {
      return this.http.post<T>(url, body, options);
    }).pipe(
      retryWhen((error: Observable<any>) => {
        return this.refresh(error);
      })
    );
  }

  private refresh(obs: Observable<any>): Observable<any> {
    return obs.pipe(
      mergeMap((x: any) => {
        if (x.status === 404) {
          return of(x);
        }
        return throwError(x);
      }),
      mergeScan((acc, value) => {
        const cur = acc + 1;
       /* if (cur === 4) {
          return throwError(value);
        }*/
        return of(cur);
      }, 0),
      mergeMap(c => {
        if (c === 4) {
          return throwError('Retried too many times');
        }

        return this.tokenObservable;
      })
    );
  }
}
