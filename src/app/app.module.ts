import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RefreshableHttpService } from './sub/service';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './sub/auth.service';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule

  ],
  providers: [
    RefreshableHttpService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
