import { Component, OnInit, NgZone } from '@angular/core';
//Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Router } from '@angular/router';
//Auth
import { AuthService } from '../services/auth.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginform : FormGroup;
  hide = true;
  user = {
    email: '',
    password: ''
  };
  //Add form builder service
  constructor(
    private fb : FormBuilder,
    private authService: AuthService, 
    private loginService: LoginService, 
    private router: Router, 
    private ngZone: NgZone,
  ) {
    // this.user = _firebaseAuth.authState;
  }

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

  signInWithFacebook(){
    this.loginService.signInWithFacebook();
  }
  signInWithGoogle(){
    this.loginService.signInWithGoogle();
  }
  signInWith42(){
    this.loginService.signInWith42();
  }
  signInWithEmail(email, pass){
    this.loginService.signInWithEmail(email, pass); 
  }
  /*
    // Old-school:
    var a2 = a.map(function(s){ return s.length });

    // ECMAscript 6 using arrow functions
    var a3 = a.map( s => s.length );
  */
  //Accessors for ngIF error handling
  get email(){
    return this.loginform.get('email');
  }
  get password(){
    return this.loginform.get('password');
  }

}
