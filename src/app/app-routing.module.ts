import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ProfileComponent } from './profile/profile.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { SetpassComponent } from './setpass/setpass.component';
//Auth
import { AuthGuard } from './services/auth-guard.service';

// import { NavComponent } from './nav/nav.component';
const routes: Routes = [
  {path: 'about', canActivate: [AuthGuard], component: AboutComponent},
  {path: 'login', component: LoginComponent},
  // {path: 'profile', canActivate: [AuthGuard], component: ProfileComponent},
  {path: 'signup', component: SignupComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', canActivate: [AuthGuard], component: HomeComponent},
  // {path: 'verifyemail', canActivate: [AuthGuard], component: VerifyemailComponent},
  {path: 'verifyemail', canActivate: [AuthGuard], component: VerifyemailComponent},
  {path: 'setpass',  canActivate: [AuthGuard], component: SetpassComponent},
  //auxilliary routing
  {
    path: 'home', canActivate: [AuthGuard], component: HomeComponent,
    children: [
      {
        path: 'settings',
        component: SettingsComponent,
        outlet: 'index',
      },
      {
        path: 'users',
        component: UsersComponent,
        outlet: 'index',
      },
      {
        path: 'feedback',
        component: FeedbackComponent,
        outlet: 'index',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        outlet: 'index',
      },
    ]
  },
  //Redirect to 404 page if page error, always put this AFTER ALL routes are defined!
  {path: '404', component: NotfoundComponent},
  {path: '**', redirectTo: '404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
