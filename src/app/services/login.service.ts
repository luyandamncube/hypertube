import { Injectable, NgZone } from '@angular/core';

import { Router } from '@angular/router';
//Auth
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private ngZone: NgZone,
  ) { }

  signInWithFacebook() {
    this.authService.signInWithFacebook()
    .then((res) => {
      // if (!this.loggedin)
      console.log(this.authService.loginmethod);
      this.authService.getUserDocument();
      this.ngZone.run(() => this.router.navigate(['setpass']));
          
      })
    .catch((err) => console.log(err));
  }
  signInWithGoogle() {
    this.authService.signInWithGoogle()
    .then((res) => {
      console.log(this.authService.loginmethod);
      this.authService.getUserDocument();
      this.ngZone.run(() => this.router.navigate(['setpass']));
      })
    .catch((err) => console.log(err));
  }
  signInWith42(){
    this.authService.signInWith42();
    this.authService.getUserDocument();
    // this.ngZone.run(() => this.router.navigate(['home']));
  }
  signInWithEmail(email, pass) {
     this.authService.signInRegular(email, pass)
      .then((res) => {
        console.log(this.authService.loginmethod);
       this.authService.getUserDocument();
        this.ngZone.run(() => this.router.navigate(['verifyemail']));
      })
      .catch(
        function(err){
          console.log("Error: " + err.message);
        }
      );    
  }

    // signInWithGithub() {
  //   this.authService.signInWithGithub()
  //   .then((res) => {
    // this.ngZone.run(() => this.router.navigate(['home']));
  //     })
  //   .catch((err) => console.log(err));
  // }

  // signInWithTwitter() {
  //   this.authService.signInWithTwitter()
  //   .then((res) => { 
  //       this.router.navigate(['home'])
  //     })
  //   .catch((err) => console.log(err));
  // }
}
