import { Component, OnInit, NgZone } from '@angular/core';
//Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Router } from '@angular/router';
//Auth
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginform : FormGroup;
  user = {
    email: '',
    password: ''
  };
  //Add form builder service
  constructor(
    private fb : FormBuilder,
    private authService: AuthService, 
    private router: Router, 
    private ngZone: NgZone,) {
    // this.user = _firebaseAuth.authState;
  }

  signInWithFacebook() {
    this.authService.signInWithFacebook()
    .then((res) => {
        //Need to use ngZone because using Ouath runs outside of Angular
        this.ngZone.run(() => this.router.navigate(['home']));
        // this.ngZone.run(() => this.router.navigate(['home'])).then();
      })
    .catch((err) => console.log(err));
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
    .then((res) => {
    this.ngZone.run(() => this.router.navigate(['home']));
      })
    .catch((err) => console.log(err));
  }


  signInWith42(){
    this.authService.signInWith42();
    // this.ngZone.run(() => this.router.navigate(['home']));
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
  //       this.router.navigate(['dashboard'])
  //     })
  //   .catch((err) => console.log(err));
  // }

  ngOnInit() {
    //Form builder stuff
    this.loginform = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
      ]],
  });
  }
  signInWithEmail(email, pass) {
    this.authService.signInRegular(email, pass)
      .then((res) => {
        console.log(res);
    this.ngZone.run(() => this.router.navigate(['home']));
      })
      .catch((err) => console.log('error: ' + err));
  }
  //Accessors for ngIF error handling
  get email(){
    return this.loginform.get('email');
  }
  get password(){
    return this.loginform.get('password');
  }

}
