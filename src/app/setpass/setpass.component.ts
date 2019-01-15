import { Component, OnInit, NgZone } from '@angular/core';
// import { Router, RoutesRecognized  } from '@angular/router';
// import { filter, pairwise } from 'rxjs/operators';
//Add password form
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

//Auth
import { AuthService } from '../services/auth.service';

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
  goback = false;
  constructor(
    private authService: AuthService, 
    private fb : FormBuilder, 
    // private router: Router, 
    // private ngZone: NgZone,
  ) { }
  checkPasswords(passform) { // here we have the 'passwords' group
    let pass = passform.controls.password.value;
    let confirm = passform.controls.confirm.value;
    let notSame = true;
    pass === confirm ? notSame =  false : notSame =  true;
    return notSame ;         
  }
  ngOnInit() {
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
    // this.ngZone.run(() => this.router.navigate(['verifyemail']));
  }
  resume(){
    // if (this.goback == false)
      this.authService.logout();
    // else
    //    this.ngZone.run(() => this.router.navigate(['/home/(index:profile)']));
    
  }

}
