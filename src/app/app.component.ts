import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';

import Fs from 'fs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Hypertube';


  constructor(private authService: AuthService, ) {}

}
