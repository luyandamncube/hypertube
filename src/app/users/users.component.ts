import { Component, OnInit } from '@angular/core';
import { AuthService} from '../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    private authService: AuthService, 
  ) { }

  ngOnInit() {
    console.log("getting users...");
    this.authService.getCollection();
  }

}
