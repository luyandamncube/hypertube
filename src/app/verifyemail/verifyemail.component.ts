import { Component, OnInit } from '@angular/core';
//Auth
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyemailComponent implements OnInit {
  sent = false;
  emailaddress = this.authService.getEmail();
  constructor(
    private authService: AuthService, 
  ) { }
    verifyEmail(){
      this.authService.verifyEmail();
      this.sent = true;
    }
  ngOnInit() {
  }

}
