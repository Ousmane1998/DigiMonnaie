import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { MonQrcodeComponent } from './mon-qrcode/mon-qrcode.component';

@NgModule({
  declarations: [
  
  ],
  imports: [
    MonQrcodeComponent,
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],

})
export class AppModule { }
