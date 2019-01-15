import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
//Auth
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  constructor(    
    private authService: AuthService, 
    private router: Router, 
    private ngZone: NgZone,

  ) { }

  ngOnInit() {
  }

  setpass(){
    this.authService.updateAvatar(this.authService.getDisplayPic());
    this.authService.updateNewuser('false');
    this.ngZone.run(() => this.router.navigate(['setpass']));
    // this.authService.logout();

  }
}
