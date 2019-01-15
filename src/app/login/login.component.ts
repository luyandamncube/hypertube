import { Component, OnInit} from '@angular/core';
//Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
//Auth
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginform : FormGroup;
  hide = true;
  user = {
    email: '',
    password: ''
  };
  constructor(
    private fb : FormBuilder,
    private authService: AuthService, 
  ) {}

  ngOnInit() {
    //Form builder stuff
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
  login(loginmethod,email, password){
    this.authService.login(loginmethod,email,password);
  }

  //Accessors for ngIF error handling
  get email(){
    return this.loginform.get('email');
  }
  get password(){
    return this.loginform.get('password');
  }

}
