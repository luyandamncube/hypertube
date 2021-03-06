import { Component, OnInit } from '@angular/core';
import { GetusersService } from '../services/getusers.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userinfo: Object;
  constructor(
    private getusers: GetusersService, 
  ) { }

  ngOnInit() {
    console.log("getting users...");
    this.userinfo = [];
    this.userinfo = this.getusers.getCollection();
    console.log(this.userinfo);
  }

}
