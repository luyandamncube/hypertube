import { Component, OnInit } from '@angular/core';
//Use these to build forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // name = new FormControl('');
  loginform : FormGroup;
  //Add form builder service
  constructor(private fb : FormBuilder) {}

  ngOnInit() {
    this.loginform =this.fb.group({
      'email': ['', Validators.required],
      'name': ['', Validators.required],
      'career': '',
    });
  }

}
