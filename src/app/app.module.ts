import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';
import { MainComponent } from './main/main.component';
import { YapsComponent } from './main/yaps/yaps.component';
import { YapComponent } from './yap/yap.component';
import { DownComponent } from './down/down.component';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { CommentComponent } from './yap/comment/comment.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    RegisterComponent,
    LoginComponent,
    NotfoundComponent,
    MainComponent,
    YapsComponent,
    YapComponent,
    DownComponent,
    SidebarComponent,
    AccountSettingsComponent,
    CommentComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinner,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: "", component: MainComponent},
      {path: "register", component: RegisterComponent},
      {path: "login", component: LoginComponent},
      {path: "yap/:id", component: YapComponent},
      {path: "down", component: DownComponent},
      {path: "accountSettings", component: AccountSettingsComponent},
      {path: ":profile", component: ProfileComponent},
      {path: "**", component: NotfoundComponent}
    ])
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
