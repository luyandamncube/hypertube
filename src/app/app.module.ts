import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule } from '@angular/material';
//Imports for Angular Material login components
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
//imports for progress bars
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
//imports for Angular firebase
import { AngularFireModule } from '@angular/fire'; 
import { environment } from '../environments/environment';
//Components
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UsersComponent } from './users/users.component';   
//Language selector
import {MatButtonToggleModule} from '@angular/material/button-toggle';
//Forms
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
//Database
import { AngularFirestore,  } from '@angular/fire/firestore';
import { NotfoundComponent } from './notfound/notfound.component'; 

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    AboutComponent,
    SettingsComponent,
    HomeComponent,
    FeedbackComponent,
    UsersComponent,
    SignupComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    // BrowserAnimationsModule,
    LayoutModule,
    //Imports for Angular Material design
    MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
    //Imports for Angular Material login components
    MatInputModule, MatFormFieldModule,  MatCheckboxModule,  MatChipsModule, 
    MatCardModule, MatProgressSpinnerModule, MatProgressBarModule,
    //Language selector
    MatButtonToggleModule,
    //Forms
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase) 
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }