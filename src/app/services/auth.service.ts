import { Injectable, NgZone, isDevMode } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore,  } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
//Snackbar
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  public userloggedin = null;
  //For storing intermediary result
  func_res = null;
  db = firebase.firestore();
  loginmethod = '';
  //User info from Observable
  uid: string;
	profilePhoto: string;
	displayName: string;
  providerId: string;
  displayEmail : string;
  
  //User info from db
  avatar: string;   
  email: string;    
  favourites: string;  
  history: string;  
  newuser: string;  
  username: string;  
  verified: string;  

  constructor(
    private _firebaseAuth: AngularFireAuth, 
    private afs : AngularFirestore,
    private router: Router,
    private ngZone: NgZone,
    public snackBar: MatSnackBar,
    // private fba : firebase,
  ) { 
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          this.profilePhoto = this.userDetails.photoURL;
          this.displayName = this.userDetails.displayName;
          this.providerId = this.userDetails.providerId;
          this.displayEmail = this.userDetails.email;
        }
        else {
          this.userDetails = null;
        }
      }
    );

  }
  loading = false;
  ngOnInit(){
 
  }
  //Adds entry to 'users' collection
  addDocument(docname, username, email, avatar, verified, newuser, favourites, history){
    // Add a new user account in collections
    return this.db.collection("users").doc(docname).set({
      username: username,
      email: email,
      avatar: avatar,
      verified: verified,
      newuser: newuser,
      favourites: favourites,
      history: history,
    })
    .then((route) => {
      console.log("User account created!");
    })
    .catch((error) => {
      this.snackBar.open( error.message, 'close', {
        duration: 4000,
      });
    });
  }
  getCollection(){
    
    // this.userloggedin = this.db.collection("users");
    this.db.collection("users").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
      });
  });
  }
  //Get entry from 'users' collection
  getUserDocument(uid){
    // this.loading = true;
    var userdoc;
    this.userloggedin = this.db.collection("users").doc(uid);
    // this.userloggedin = this.db.collection("users").doc(uid);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.userloggedin.get()
        .then((doc) => {
          if (doc.exists) {
            userdoc = doc.data();
            console.log("existing user");
          }
          else{
            console.log("new user");
            // addDocument(uid,username, email, avatar,verified,newuser,favourites,history);
            this.addDocument(uid,'',this.displayEmail, this.profilePhoto, 'false', 'true','','');
            console.log("added doc!");
            // console.log("avatar: "+ this.profilePhoto);
            // return promise;
          }
        })
        .then(() => this.setAttribute(userdoc.avatar, 'avatar'))
        .then(() => this.setAttribute(userdoc.email, 'email'))
        .then(() => this.setAttribute(userdoc.favourites, 'favourites'))
        .then(() => this.setAttribute(userdoc.history, 'history'))
        .then(() => this.setAttribute(userdoc.newuser, 'newuser'))
        .then(() => this.setAttribute(userdoc.username, 'username'))
        .then(() => this.setAttribute(userdoc.verified, 'verified'))
        .catch((error) =>{
          // this.loading = false
          this.snackBar.open( error.message, 'close', {
            duration: 4000,
          });
        });
      resolve();
    }, 1000);
    });
          // this.loading = false;
  }
  createAccount(email, password){
    return  this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
    .catch((error) => {
        this.snackBar.open( error.message, 'close', {
          duration: 4000,
        });
    });
  }
  login(loginmethod, email, password){
    console.log(loginmethod);
    if (loginmethod == 'facebook.com'){
      return this.signInWithFacebook();
    } else if (loginmethod == 'google.com'){
      return this.signInWithGoogle();
    } else if (loginmethod == 'email'){
      return this.signInRegular(email,password);
    } else if (loginmethod == 'intra.42.fr'){
      this.signInWith42();
    }
  }
  signInWithFacebook() {
    this.loginmethod = 'facebook.com';
    var auth = firebase.auth();
    return auth.signInWithPopup(
          new firebase.auth.FacebookAuthProvider()
    )
    .then((result) => this.func_res = result)
    .then(() => this.getUserDocument(auth.currentUser.uid)
    .then(() => this.loadhome(this.func_res.isNewUser))
    .catch((error) =>{

      if (error.code === 'auth/account-exists-with-different-credential') {
        var pendingCred = error.credential;
        var email = error.email;
        auth.fetchSignInMethodsForEmail(email).then(function(methods) {
          if (methods[0] === 'password') {
            var password = window.prompt('Please provide the password for ' + email);   
            auth.signInWithEmailAndPassword(email, password).then((user) =>{
              return auth.currentUser.linkWithCredential(pendingCred);
            }).then(() =>{
              this.snackBar.open( 'facebook account successfully linked!', 'close', {
                duration: 4000,
              });
            });
            return;
          }
          const provider = new firebase.auth.GoogleAuthProvider();
          auth.signInWithPopup(provider).then(function(result) {
          result.user.linkAndRetrieveDataWithCredential(pendingCred).then((usercred) => {
          }).catch( (error) => {
              this.snackBar.open( error.message, 'close', {
                duration: 4000,
              });
            });
          });
        });
      }
    }));
  }
  signInWithGoogle() {
    var auth = firebase.auth();
    this.loginmethod = 'google.com';
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
    .then((result) =>  this.func_res = result)
    .then(() => this.getUserDocument(auth.currentUser.uid)
    .then(() => this.loadhome(this.func_res.isNewUser))
    .catch((error) => {
        this.snackBar.open( error.message, 'close', {
          duration: 4000,
        });
    }));
  }
  signInWith42(){
    if (isDevMode() === true){
      //Hosted locally
      window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=52ed13ae84d61441732eed003680d2c0033d7211f69398b62fdf42f360d062d8&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin&response_type=code';
    }
    else{
      //Deployed on firebase
      window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=52ed13ae84d61441732eed003680d2c0033d7211f69398b62fdf42f360d062d8&redirect_uri=https%3A%2F%2Fhypertube-16d52.firebaseapp.com%2Flogin&response_type=code';
    }
  }
  signInRegular(email, password) {
    var auth = firebase.auth();
    return auth.signInWithEmailAndPassword(email, password)
    .then((result) =>  this.func_res = result)
    .then(() => this.getUserDocument(auth.currentUser.uid)
    .then(() => this.loadhome(this.func_res.isNewUser))
    //PUT THE ABOVE BACK ON AFTER YOU HAVE FIXED 42 LOGIN
    .catch((error) => {
        this.snackBar.open( error.message, 'close', {
          duration: 4000,
        });
    }));
  }
  //Get methods for user info
  getUsername(){
    return this.userDetails.displayName;
  }
  getUserID(){
    return this.userDetails.uid;
  }
  getEmail(){
    return this.userDetails.email;
  }
  getDisplayPic(){
    return this.userDetails.photoURL;
  }
  //Set methods for user info
  setAttribute(input:string, output){
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this[output]= input;
        console.log(output+": "+this[output]);

        resolve();
      }, 1000);
    });
    return promise;
  }
  //User management
  isLoggedIn() {
  if (this.userDetails == null ) {
      return false;
    } else {
      return true;
    }
  }
  isVerified(){
    return this.userDetails.emailVerified;
  }
  verifyEmail(){
    this._firebaseAuth.auth.currentUser.sendEmailVerification().then(function() {
      // Email sent.
    }).catch((error) => {
      // An error happened.
      this.snackBar.open( error.message, 'close', {
        duration: 4000,
      });
    });
  }
  sendPasswordReset(emailadress){
    var user = this._firebaseAuth.auth;
    return user.sendPasswordResetEmail(emailadress).then((res) => {
      // Email sent.
    }).catch((error) => {
      // An error happened.
      this.snackBar.open( error.message, 'close', {
        duration: 4000,
      });
    });
  }
  setPassword(newPassword){
    this._firebaseAuth.auth.currentUser.updatePassword(newPassword).then(function(){
      }).catch((error) =>{
        this.snackBar.open( error.message, 'close', {
          duration: 4000,
        });
      });

  }
 //Routing
  loadhome(isNewUser){
    // console.log("really new user? " + isNewUser);
  var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isNewUser === true){
        this.ngZone.run(() => this.router.navigate(['success']));
        return promise;
      }else{
        this.ngZone.run(() => this.router.navigate(['verifyemail']));
        return promise;
      }

      resolve();
    }, 1000);
  });
 
  }
  //Update db methods
  updateAvatar(info){
    return this.userloggedin.update({
      avatar: info
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
        this.snackBar.open( error.message, 'close', {
          duration: 4000,
        });
    });
  }
  updateEmail(info){
    return this.userloggedin.update({
      email: info
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch((error) =>{
      // The document probably doesn't exist.
      this.snackBar.open( error.message, 'close', {
        duration: 4000,
      });
    });
  }
  updateFavourites(info){
    return this.userloggedin.update({
      favourites: info
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch((error) => {

      this.snackBar.open( error.message, 'close', {
        duration: 4000,
      });
    });
  }
  updateHistory(info){
    /*
    return this.userloggedin.update({
      history: info
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
    */
    //apend JSON string?
  }
  updateNewuser(info){
    return this.userloggedin.update({
      newuser: info
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      this.snackBar.open( error.message, 'close', {
        duration: 4000,
      });
    });
  }
  updateUsername(info){
    return this.userloggedin.update({
      username: info
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      this.snackBar.open( error.message, 'close', {
        duration: 4000,
      });
    });
  }
  updateVerified(info){
    return this.userloggedin.update({
      verified: info
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      this.snackBar.open( error.message, 'close', {
        duration: 4000,
      });
    });
  }
  logout() {
    this._firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['login']));
  }
}

