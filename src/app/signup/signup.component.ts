import { Component, OnInit } from '@angular/core';
//Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { AngularFirestore,  } from '@angular/fire/firestore';
import { tap, first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { error } from 'util';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupform : FormGroup;
  changepass = false;
  constructor(
    private fb : FormBuilder, 
    // private afs : AngularFirestore,
    private authService : AuthService,
    public snackBar: MatSnackBar,
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
  createUser(email, password){
    this.quickloginemail = email;
    this.quickloginpass = password;
    return this.authService.createAccount(this.quickloginemail , this.quickloginpass );
    // if (error == false){
    //   return (false);
    // }else{
    //   return(true);
    // }
  }
  signInWithEmail(){
    this.authService.signInRegular(this.quickloginemail, this.quickloginpass); 
  }
  async submitHandler(){
    this.loading = true;
    var formValue = this.signupform.value;
    try{
      return this.createUser(formValue.email, formValue.password)
      .then(() => {
        this.success = true;
        this.authService.signInRegular(formValue.email, formValue.password)
      })
      .then(() => {
         var currentuser;
          currentuser = this.authService.getUserID();
          this.authService.addDocument(currentuser,formValue.username, formValue.email, '', 'false','true', '', '');
        })

    }catch{(error) => {
      this.loading = false; 
      this.success = false;
      this.snackBar.open( error.message, 'close', {
        duration: 4000,
      });
    }}
}}
