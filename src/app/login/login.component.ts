import { Component, OnInit } from '@angular/core';
//Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { AngularFirestore,  } from '@angular/fire/firestore';
// import { tap, first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginform : FormGroup;
  //Add form builder service
  constructor(private fb : FormBuilder, /*private afs : AngularFirestore*/) {}

  ngOnInit() {
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

  //Accessors for ngIF error handling
  get email(){
    return this.loginform.get('email');
  }
  get password(){
    return this.loginform.get('password');
  }

}
