import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { WidgetComponent } from './components/widget/widget.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    WidgetComponent,
    RouterModule.forRoot([
      {
        path: 'sinis',
        loadChildren: () => import('./routes').then((m) => m.APP_ROUTES)
      },
      {
        path: '**',
        redirectTo: 'sinis'
      }
    ])
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {
  constructor(
    private injector: Injector
  ) {}

  ngDoBootstrap(){
    const elem = createCustomElement(AppComponent, {injector: this.injector})
    customElements.define('wc-sinsitro-module', elem);
  }
}

