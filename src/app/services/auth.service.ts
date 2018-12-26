import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Create an observable user variable
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  constructor(
    private _firebaseAuth: AngularFireAuth, 
    private router: Router
    ) { 
    this.user = _firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
      if (user) {
        this.userDetails = user;
        //Do something with user info. For testing 
        console.log(this.userDetails);
      }
      else {
        this.userDetails = null;
      }
      }
    );

  }
  signInWith42(){
    // console.log("testing");
    window.alert("Need to link the API")
  }
  signInWithFacebook() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    )
  }

  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  // signInWithGithub() {
  //   return this._firebaseAuth.auth.signInWithPopup(
  //     new firebase.auth.GithubAuthProvider()
  //   )
  // }

  // signInWithTwitter() {
  //   return this._firebaseAuth.auth.signInWithPopup(
  //     new firebase.auth.TwitterAuthProvider()
  //   )
  // }

  signInRegular(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential( email, password );
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password)
  }
  //Get methods for user info
  getUsername(){
    return this.userDetails.displayName;
  }
  getEmail(){
    return this.userDetails.email;
  }
  getDisplayPic(){
    return this.userDetails.photoURL;
  }
  getVerified(){
    return this.userDetails.emailVerified;
  }

  //User management
  isLoggedIn() {
  if (this.userDetails == null ) {
      return false;
    } else {
      return true;
    }
  }
  verifyEmail(){
    this._firebaseAuth.auth.currentUser.sendEmailVerification().then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
  }
  logout() {
    this._firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['login']));
  }

}

