import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, 
  MatIconModule, MatListModule, MatCardModule } from '@angular/material';
//Imports for Angular Material login components
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
//Import for dropdown menu
import {MatMenuModule} from '@angular/material/menu';
//imports for progress bars
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
//imports for Angular firebase
import { AngularFireModule } from '@angular/fire'; 
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
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
//Auth Services
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
// import { LoginService } from './services/login.service';
import { ProfileComponent } from './profile/profile.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { SetpassComponent } from './setpass/setpass.component';
import { SuccessComponent } from './success/success.component';
import { ForgotpassComponent } from './forgotpass/forgotpass.component';

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
    NotfoundComponent,
    ProfileComponent,
    VerifyemailComponent,
    SetpassComponent,
    SuccessComponent,
    ForgotpassComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    // BrowserAnimationsModule,
    LayoutModule,
    //Imports for Angular Material design
    MatToolbarModule, MatButtonModule, MatSidenavModule,
    MatIconModule, MatListModule, MatExpansionModule,
    MatInputModule, MatFormFieldModule,  MatCheckboxModule,  
    MatChipsModule, MatCardModule, MatProgressSpinnerModule, 
    MatMenuModule, MatProgressBarModule,MatSnackBarModule,
    //Language selector
    MatButtonToggleModule,
    //Forms
    ReactiveFormsModule,
    //Auth
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AngularFirestore, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }