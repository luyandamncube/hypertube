import { Component, NgZone } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//Imports for Angular Routing Loading Indicator

//Auth
import { AuthService } from '../services/auth.service';

import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  apptitle = 'Hypertube';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  current_username = "";
  current_email = "";
  current_dp= "";

  //Constructor injection for Angular Routing Loading Indicator
  loading = false;
  constructor(
    private breakpointObserver: BreakpointObserver, 
    private authService: AuthService, 
    private router: Router, 
    private ngZone: NgZone,

  ){

    /*
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
    */
    if (authService.isLoggedIn()){
     
      this.current_username = authService.username;
      this.current_email = authService.email;
      this.current_dp = authService.avatar;
    }


  }
  
  logout() {
    this.authService.logout();
    this.ngZone.run(() => this.router.navigate(['/']));
  }
}
