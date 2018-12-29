import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
//Auth
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyemailComponent implements OnInit {
  sent = false;
  reset_sent = false;
  // pass = false;
  emailaddress = this.authService.getEmail();
  loginmethod = this.authService.getLoginMethod();
  message = 'A verification email was sent to';

  //message = 'Please check your email inbox at';
  constructor(
    private authService: AuthService, 
    private router: Router, 
    private ngZone: NgZone,

  ) { }
    verifyEmail(){
      this.authService.verifyEmail();
      this.sent = true;
      this.message = 'Please check your email inbox at';
      // console.log(this.loginmethod);
    }
    sendPasswordReset(){
      this.sent = false;
      this.authService.sendPasswordReset();
      this.reset_sent = true;
    }


  ngOnInit() {
    if (this.authService.isVerified() == true)
      this.ngZone.run(() => this.router.navigate(['home']));

  }

}
