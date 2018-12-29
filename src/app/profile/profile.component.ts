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
  user = {
    name: this.authService.getUsername(),
    avatar: this.authService.getDisplayPic(),
    email:  this.authService.getEmail(),
    password: '',
    verified: this.authService.isVerified(),
  };
  constructor(
    private fb : FormBuilder,
    private authService: AuthService, 
  ) { }

  ngOnInit() {
    //Form builder stuff
    this.profileform = this.fb.group({
      name: ['' , [
        Validators.required, 
      ]],
      avatar: [this.authService.getDisplayPic(), [
        Validators.required, 
      ]],
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

}
