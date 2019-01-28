import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class GetusersService {
  // UserInfo: AngularFirestoreCollection<any>;
  userinfo = new Array;
  db = firebase.firestore();

  constructor(
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    // var array = new Array;
    this.userinfo = [];
    this.db.collection("users").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          //insert entries into object
          this.userinfo.push(doc.data());
          // this.userinfo[doc.id] = doc.data();

      });
     
    });
    console.log(this.userinfo);
    return this.userinfo;
  }
  // getCollection(): AngularFirestoreCollection<any> {
  //   return this.users;
  // }

  getCollection(){
    this.userinfo = [];
    this.db.collection("users").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.userinfo.push(doc.data());
      });
    });
    return this.userinfo;
  }
}
