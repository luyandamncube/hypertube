import { Component, OnInit, NgZone, isDevMode } from '@angular/core';
//Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
//Auth
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
//POST
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
//Snackbar
import {MatSnackBar} from '@angular/material';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginform : FormGroup;
  hide = true;
  loading  = false;
  user = {
    email: '',
    password: ''
  };
  constructor(
    private fb : FormBuilder,
    private authService: AuthService, 
    private route: ActivatedRoute,
    private http: HttpClient,
    private _firebaseAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    public snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    //Form builder stuff

    //URL capture for 42 auth token
    if (this.route.snapshot.queryParams.code) {
      console.log(this.route.snapshot.queryParams.code);
			this.captureAuthToken(this.route.snapshot.queryParams.code);
    }

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
    this.loading = true;
    if (loginmethod != 'intra.42.fr'){
      this.authService.login(loginmethod,email,password).then((result) => {
        this.loading = false;
      }).catch((error) =>{
        this.loading = false;
        this.snackBar.open( error.message, 'close', {
          duration: 4000,
        });
      });
    } else {
      //Because signInWith42() does not return a promise...
      this.authService.login(loginmethod,email,password);
    }

  }

  captureAuthToken(token){
    // console.log(isDevMode());
    let uri = isDevMode() ? 'http://localhost:4200/login' : 'https://hypertube-16d52.firebaseapp.com/login' ;
    const parameters = {
			code: token,
			grant_type: 'authorization_code',
			client_id: '52ed13ae84d61441732eed003680d2c0033d7211f69398b62fdf42f360d062d8',
			client_secret: '171423ed37c14a1020ddeb7ff0af21b45b7a299459ef556443b358222a9ef19d',
			redirect_uri: uri
    };
    // console.log('code: '+parameters.code);
    // console.log('grant_type: '+parameters.grant_type);
    // console.log('client_id: '+parameters.client_id);
    // console.log('client_secret: '+parameters.client_secret);
    // console.log('redirect_uri: '+parameters.redirect_uri);

    return this.http.post('https://api.intra.42.fr/oauth/token', parameters).subscribe(async (res) => {
      this.loading = true;
      const graphApiUrl = 'https://api.intra.42.fr/v2/me?access_token=' + res['access_token'];
      let headers = { headers: new HttpHeaders({ 'content-Type': 'application/vnd.api+json' }) };
      
      await this.http.get(graphApiUrl, headers).subscribe(async (user) => {
        console.log(user['data']['attributes']);
        
      await this._firebaseAuth.auth.fetchSignInMethodsForEmail(user['data']['attributes']['email']).then(async (providers) => {
        // console.log("number of login methods: "+providers.length)
          if (providers.length > 0) {
            //Sign in
            await this.authService.signInRegular(user['data']['attributes']['email'], 'temppass');
            console.log("Existing user");
          } else {
            // new user
            console.log("New user");
            await this.authService.createAccount(user['data']['attributes']['email'], 'temppass');

            await this.authService.signInRegular(user['data']['attributes']['email'], 'temppass');
          }
          //   this.authService.signInWithEmailAndPassword(this.email42, this.pass42)
          // } else {
          //   this.authService.login42(this.email42, this.pass42, data, this.username42, this.photo42)
          // }
          // console.log(providers);
        })

      });

      // console.log(res);
  });
    
    //response
    //http://localhost:4200/login?code=caf8ebdecf7c7e7abd70dd36f26458f7045b92e3b289584c37e6f53afab65eb9
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
