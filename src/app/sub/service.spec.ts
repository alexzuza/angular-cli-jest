import { fakeAsync, tick } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './auth.service';
import { RefreshableHttpService } from './service';


describe('Share operator causes Jest test to fail', () => {
  it('refreshes token when getting a 401 but gives up after 3 tries', fakeAsync(() => {
    const errorObs = new Observable(obs => {
      setTimeout(() => {
        obs.error({ status: 404 });
      });
    }).pipe(
      tap(data => {
        console.log('token refreshed');
      })
    );
    const HttpClientMock = jest.fn<HttpClient>(() => ({
      post: jest.fn().mockImplementation(() => {
        return errorObs;
      })
    }));
    const httpClient = new HttpClientMock();

    const tokenObs = new Observable(obs => {
      obs.next({ someProperty: 'someValue' });
      obs.complete();
    });

    const AuthenticationServiceMock = jest.fn<AuthenticationService>(() => ({
      refresh: jest.fn().mockImplementation(() => {
        console.log('refreshing...');
        return tokenObs;
      })
    }));
    const authenticationService = new AuthenticationServiceMock();

    const service = new RefreshableHttpService(httpClient, authenticationService);

    service.post('controller', {}).subscribe(
      data => {
        expect(true).toBeFalsy();
      },
      (error: any) => {
        debugger
        expect(error).toBe('Retried too many times');
        expect(authenticationService.refresh).toHaveBeenCalledTimes(3);
      }
    );
    tick();

  }));
});
