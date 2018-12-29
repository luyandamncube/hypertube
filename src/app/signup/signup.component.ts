import { Component, OnInit } from '@angular/core';
//Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AngularFirestore,  } from '@angular/fire/firestore';
import { tap, first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupform : FormGroup;
  constructor(
    private fb : FormBuilder, 
    private afs : AngularFirestore,
    private authService : AuthService,
    private loginService : LoginService,
  ) {}
  //Regex, aplhanumeric characters only
  includes = "[a-zA-Z0-9]*";
  //Asynchronous form states
  loading = false;
  success = false;
  hide = true;
  private quickloginpass = '';
  private quickloginemail = '';
  checkPasswords(signupform) { // here we have the 'passwords' group
    let pass = signupform.controls.password.value;
    let confirm = signupform.controls.confirm.value;
    let notSame = true;
    pass === confirm ? notSame =  false : notSame =  true;
    return notSame ;         
  }
  ngOnInit() {
    this.signupform = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(this.includes),
      ]],    
      email: ['', [
        Validators.required, 
        Validators.email,
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
      ]],
      confirm: ['', [
        Validators.required, 
      
    ]],
    }, {validators: this.checkPasswords });
  }

  //Accessors for ngIF error handling
  get username(){
    return this.signupform.get('username');
  }
  get email(){
    return this.signupform.get('email');
  }
  get password(){
    return this.signupform.get('password');
  }
  get confirm(){
    return this.signupform.get('confirm');
  }
  /*
firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
  */
  createUser(email, password){
    this.authService.createAccount(email, password);
    this.quickloginemail = email  ;
    this.quickloginpass= password  ;
  }
  signInWithEmail(){
    this.loginService.signInWithEmail(this.quickloginemail, this.quickloginpass); 
  }
  async submitHandler(){
    this.loading = true;

    var formValue = this.signupform.value;

    /*
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
    */
    try{
      console.log();
      this.createUser(formValue.email, formValue.password);
      this.success = true;
    }catch(err){
      console.log(err);
    }
    /*
    try{
      await this.afs.collection('users').add(formValue);
      console.log(formValue);
      this.success = true;
    }catch(err){
      console.log(err);
    }
    */
  }



}
