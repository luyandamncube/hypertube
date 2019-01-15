import { Component, OnInit, NgZone } from '@angular/core';
//Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
//Auth
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.scss']
})
export class ForgotpassComponent implements OnInit {
  emailform : FormGroup;
  hide = true;
  sent = false;
 
  constructor(
    private fb : FormBuilder,
    private router: Router, 
    private ngZone: NgZone,
    private authService: AuthService, 
    private _firebaseAuth: AngularFireAuth, 

  ) { }

  ngOnInit() {
    this.emailform = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
      ]],

    });

  }
  useremail = '';
  sendemail(emailadress){
    var user = this._firebaseAuth.auth;
    return user.sendPasswordResetEmail(emailadress).then((res) => {
      this.sent = true;
      this.useremail = emailadress;
    }).catch(
      function(error) {
        // An error happened.
        console.log("Error sending reset link: "+ error.message);
      });

  }
  get email(){
    return this.emailform.get('email');
  }

}
