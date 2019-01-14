import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
//Add password form
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

//Auth
import { AuthService } from '../services/auth.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-setpass',
  templateUrl: './setpass.component.html',
  styleUrls: ['./setpass.component.scss']
})
export class SetpassComponent implements OnInit {
  passform : FormGroup;
  newPassword = null;
  hide = true;
  pass = false;
  constructor(
    private authService: AuthService, 
    private loginService: LoginService, 
    private fb : FormBuilder, 
    private router: Router, 
    private ngZone: NgZone,
  ) { }
  checkPasswords(passform) { // here we have the 'passwords' group
    let pass = passform.controls.password.value;
    let confirm = passform.controls.confirm.value;
    let notSame = true;
    pass === confirm ? notSame =  false : notSame =  true;
    return notSame ;         
  }
  ngOnInit() {

    if (this.authService.isVerified() == true)
      this.ngZone.run(() => this.router.navigate(['verifyemail']));
    this.passform = this.fb.group({   
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
      ]],
      confirm: ['', [
        Validators.required, 
      
    ]],
    }, {validators: this.checkPasswords });

  }
  get password(){
    return this.passform.get('password');
  }
  get confirm(){
    return this.passform.get('confirm');
  }

  setPassword(newPassword){
    this.authService.setPassword(newPassword);
    this.pass = true;
    this.ngZone.run(() => this.router.navigate(['verifyemail']));
  }
  // signInWithFacebook(){
  //   this.loginService.signInWithFacebook();
  // }
  // signInWithGoogle(){
  //   this.loginService.signInWithFacebook();
  // }
  // signInWith42(){
  //   this.loginService.signInWithFacebook();
  // }
  // signInWithEmail(email, pass){
  //   this.loginService.signInWithEmail(email, pass); 
  // }
}
