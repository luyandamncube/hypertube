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
import { NavComponent } from './nav/nav.component';
// import { HomeComponent } from './home/home.component';
// import { ContactComponent } from './contact/contact.component';
const routes: Routes = [
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  //Redirect to 404 page if page error
  // {path: '**', redirectTo: 'notfound'},
  //auxilliary routing
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  {
    path: 'home', component: HomeComponent,
    children: [
      {
        path: 'settings',
        component: SettingsComponent,
        outlet: 'home',
      },
      {
        path: 'users',
        component: UsersComponent,
        outlet: 'home',
      },
      {
        path: 'feedback',
        component: FeedbackComponent,
        outlet: 'home',
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
