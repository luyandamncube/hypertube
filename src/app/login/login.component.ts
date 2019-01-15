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

  /*
	fourtytwo(code: string) {
		const params = {
			code: code,
			grant_type: 'authorization_code',
			client_id: '52ed13ae84d61441732eed003680d2c0033d7211f69398b62fdf42f360d062d8',
			client_secret: '71ae6d11e5da5bdd03c9dcae3afe961c16089038137df2da7875ebc33d33f820',
			redirect_uri: 'http://localhost:4200/Login'
		};

		return this.sub42post = this.http.post('https://api.intra.42.fr/oauth/token', params)
			.subscribe((res) => {
  */

  //Accessors for ngIF error handling
  get email(){
    return this.loginform.get('email');
  }
  get password(){
    return this.loginform.get('password');
  }

}
