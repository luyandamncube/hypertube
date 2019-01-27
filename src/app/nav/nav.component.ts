import { Component, NgZone } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

//Auth
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { load } from '@angular/core/src/render3';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  apptitle = 'Hypertube';
  loading = false;
  name: '';
  avatar: '';
  email:  '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver, 
    private authService: AuthService, 
    private router: Router, 
    private ngZone: NgZone
  ){

  }
  
  ngOnInit(){
    // this.loading = true;
    this.loadmedia()
    // .then(() => {
    //   if (this.avatar == undefined || this.avatar == null) 
    //     this.loading = false;
    // });

    // .then(() => this.loading = false)
    // this.avatar =  this.authService.avatar;
    // this.name =  this.authService.username;
    // this.user.email =  this.authService.email;
  }

  setAttribute(input, output){
   var promise = new Promise((resolve, reject) => {
     setTimeout(() => {
       this[output]= input;
       console.log(output+": "+this[output]);
       resolve();
     }, 1000);
   });
   return promise;
  }
  async loadmedia(){
    // this.loading = true;
    return this.setAttribute(this.authService.avatar, 'avatar')
    .then(() => this.setAttribute(this.authService.email, 'email'))
    .then(() => this.setAttribute(this.authService.username, 'name'))
    // .then(() => this.loading = false)
  }
  logout() {
    this.authService.logout();
    this.ngZone.run(() => this.router.navigate(['/']));
  }
}
