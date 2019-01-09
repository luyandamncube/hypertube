import { Component, OnInit } from '@angular/core';
//Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { AngularFirestore,  } from '@angular/fire/firestore';
import { tap, first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupform : FormGroup;
  changepass = false;
  constructor(
    private fb : FormBuilder, 
    // private afs : AngularFirestore,
    private authService : AuthService,
    private loginService : LoginService,
  ) {}
  //Regex, aplhanumeric characters only
  includes = "[a-zA-Z0-9]*";
  //Asynchronous form states
  loading = false;
  success = false;
  hide = true;
  private quickloginpass = '';
  private quickloginemail = '';
  checkPasswords(signupform) { // here we have the 'passwords' group
    let pass = signupform.controls.password.value;
    let confirm = signupform.controls.confirm.value;
    let notSame = true;
    pass === confirm ? notSame =  false : notSame =  true;
    return notSame ;         
  }
  ngOnInit() {
    this.signupform = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(this.includes),
      ]],    
      email: ['', [
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

  //Accessors for ngIF error handling
  get username(){
    return this.signupform.get('username');
  }
  get email(){
    return this.signupform.get('email');
  }
  get password(){
    return this.signupform.get('password');
  }
  get confirm(){
    return this.signupform.get('confirm');
  }

  createUser(email, password){
    this.quickloginemail = email;
    this.quickloginpass = password;
    var error = this.authService.createAccount(this.quickloginemail , this.quickloginpass );
    if (error == false){
      console.log(error);
      return (false);
    }else{
      return(true);

    }
  }
  signInWithEmail(){
    this.loginService.signInWithEmail(this.quickloginemail, this.quickloginpass); 
  }
  async submitHandler(){
    this.loading = true;

    var formValue = this.signupform.value;

    try{
      console.log("Entered user signup...");
      var error = this.createUser(formValue.email, formValue.password);
      if (error == true){
        this.success = true;
      var currentuser;
      //Quick login user
      this.authService.signInRegular(formValue.email, formValue.password).then((res) => {
        // console.log(this.authService.loginmethod);
        // this.ngZone.run(() => this.router.navigate(['verifyemail']));
        currentuser = this.authService.getUserID();
        this.authService.addDocument(currentuser,formValue.username, formValue.email, '', 'false', '', '');
        console.log("user logged in: "+ currentuser);
      })
      .catch(
        function(err){
          console.log("Error: " + err.message);
        }
      );

        //log user in : FUTURE WORK
      /*
        this.signInWithEmail();
        console.log("pass: "+this.quickloginpass);
        console.log("email: "+this.email)
        */
      }
      

    }catch(err){
      console.log(err);
      this.success = false;
    }
    /*
    try{
      await this.afs.collection('users').add(formValue);
      console.log(formValue);
      this.success = true;
    }catch(err){
      console.log(err);
    }
    */
  }



}
