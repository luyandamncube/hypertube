import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
//User collection as observable
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserprofilesService {
  
  db = firebase.firestore();
  constructor() { }

  getCollection(){
    
    // this.userloggedin = this.db.collection("users");
    this.db.collection("users").get().then(
      
      function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          console.log(doc.id, " => ", doc.data());
      });
      });
  }
}
