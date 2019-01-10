import { Component, OnInit } from '@angular/core';
//Edit profile form
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
//To retrieve user info
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileform : FormGroup;
  changedpass = false;
  checkPasswords(signupform) { // here we have the 'passwords' group
  let pass = signupform.controls.password.value;
  let confirm = signupform.controls.confirm.value;
  let notSame = true;
  pass === confirm ? notSame =  false : notSame =  true;
  return notSame ;         
  }
  user = {
    name: this.authService.username,
    avatar: this.authService.avatar,
    email:  this.authService.email,
    password: '',
    verified: this.authService.isVerified(),
  };
  constructor(
    private fb : FormBuilder,
    private authService: AuthService, 
  ) { }
  //Regex, aplhanumeric characters only
  includes = "[a-zA-Z0-9]*";
  ngOnInit() {
    //Form builder stuff
    this.profileform = this.fb.group({
      name: [this.user.name , [
        Validators.required, 
        Validators.minLength(5),
        Validators.pattern(this.includes),
      ]],
      avatar: [this.user.avatar, [
        Validators.required, 
      ]],
      email: [this.user.email , [
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
  resetform(){
    this.profileform.setValue({name: this.user.name, email: this.user.email, avatar: this.user.avatar, password: '', confirm :'' });
  }
  changepass(){
    if(this.changedpass = false)
      this.changedpass = true;
    else
      this.changedpass = false;
  }

  get email(){
    return this.profileform.get('email');
  }
  get avatar(){
    return this.profileform.get('avatar');
  }
  get name(){
    return this.profileform.get('name');
  }
  get password(){
    return this.profileform.get('password');
  }
}
