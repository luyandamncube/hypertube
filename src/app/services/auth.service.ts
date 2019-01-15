import { Injectable, NgZone } from '@angular/core';
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
  // public userDocument = null;

  db = firebase.firestore();
  // colelction  = this.db.collection("users");
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

    
  // Use fat arrow for linked functions, able to access class methods inside
  getUserDocument(uid){
    var userdoc;

    this.userloggedin = this.db.collection("users").doc(uid);
    this.userloggedin.get().then(async (doc) => {
      if (doc.exists) {
        userdoc = doc.data();

        this.avatar = userdoc.avatar;
        this.email = userdoc.email;
        this.favourites = userdoc.favourites;
        this.history = userdoc.history;
        this.newuser = userdoc.newuser;
        this.username = userdoc.username;
        this.verified = userdoc.verified;
      } else {
          //addDocument(docname,username, email, avatar,verified,newuser,favourites,history)
          try{
            await this.addDocument(uid,'',this.displayEmail, this.profilePhoto, 'false', 'true','','');

          }catch(error){
            this.snackBar.open( error.message, 'close', {
              duration: 4000,
            });
          }
          // this.loading = false;

          return false;
      }
  }).catch((error) => {
      this.snackBar.open( error.message, 'close', {
        duration: 4000,
      });
  });
  // this.loading = false;
  return true;
  }

  //Adds entry to 'users' collection
  addDocument(docname, username, email, avatar, verified, newuser, favourites, history){
        console.log("user ID found: "+ docname);
        // Add a new user account in collections
        this.db.collection("users").doc(docname).set({
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

  createAccount(email, password){
    this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
        this.snackBar.open( error.message, 'close', {
          duration: 4000,
        });
      return false;
    });
      return true;
  }

  login(loginmethod, email, password){
    console.log(loginmethod);
     if (loginmethod == 'facebook.com'){
      this.signInWithFacebook().then((res) => {

      })
      .catch((err) => console.log(err));
     } else if (loginmethod == 'google.com'){
       this.signInWithGoogle().then((res) => {

      })
      .catch((err) => console.log(err));
    } else if (loginmethod == 'email'){
      this.signInRegular(email,password).then((res) => {

      })
      .catch((err) => console.log(err));
      }else if (loginmethod == 'intra.42.fr'){
        this.signInWith42();
      /*.then((res) => {
        this.getUserDocument();
        this.ngZone.run(() => this.router.navigate(['setpass']));
        })
      .catch((err) => console.log(err));
      */
    }

  }
  signInWith42(){
 //When deployed on firebase
//  return window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=52ed13ae84d61441732eed003680d2c0033d7211f69398b62fdf42f360d062d8&redirect_uri=https%3A%2F%2Fhypertube-16d52.firebaseapp.com%2Fhome&response_type=code';
   //When on localhost
   return window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=52ed13ae84d61441732eed003680d2c0033d7211f69398b62fdf42f360d062d8&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fhome&response_type=code';
    /*
    return window.location.href = 'https://api.intra.42.fr/oauth/authorize?
    client_id=b654f310dbf2bada79b1ed5cb10d6b19ece7fc5649ad79ca9e4dbfc349fd082c&
    redirect_uri=http%3A%2F%2Flocalhost%3A4200%2FLogin&
    response_type=code'
    */
  }

  signInWithFacebook() {
    this.loginmethod = 'facebook.com';
    var auth = firebase.auth();
    return auth.signInWithPopup(
          new firebase.auth.FacebookAuthProvider()
    ).then((result) => {

      // this.loginmethod = result.credential.providerId; 
      this.getUserDocument(auth.currentUser.uid);
      console.log("is new user: "+ result.additionalUserInfo.isNewUser);
      if (result.additionalUserInfo.isNewUser === true){
        this.ngZone.run(() => this.router.navigate(['success']));
      }else{
        this.ngZone.run(() => this.router.navigate(['verifyemail']));
      }
    }).catch((error) =>{
      
      // Handle errors here
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Step 2.
        // User's email already exists.
        // The pending Facebook credential.
        var pendingCred = error.credential;
        // The provider account's email address.
        var email = error.email;
        // Get sign-in methods for this email.
        auth.fetchSignInMethodsForEmail(email).then(function(methods) {
          // Step 3.
          // If the user has several sign-in methods,
          // the first method in the list will be the "recommended" method to use.
          if (methods[0] === 'password') {
          // Asks the user his password.  
          // In real scenario, you should handle this asynchronously.
        // var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
        var password = window.prompt('Please provide the password for ' + email);
            //  return firebase.auth().signInWithEmailAndPassword(existingEmail, password);    
            auth.signInWithEmailAndPassword(email, password).then(function(user) {
              // Step 4a.
              //firebase.auth().currentUser.linkWithCredential(pendingCred).then
              return auth.currentUser.linkWithCredential(pendingCred);
            }).then(function() {
              // Facebook account successfully linked to the existing Firebase user.
              //ADD "Successfully linked" component here
              // console.log("facebook account successfully linked!");
              this.snackBar.open( 'facebook account successfully linked!', 'close', {
                duration: 4000,
              });

            });
            return;
          }
          // All the other cases are external providers.
          // Construct provider object for that provider.
          // TODO: implement getProviderForProviderId.
          const provider = new firebase.auth.GoogleAuthProvider();
          // At this point, you should let the user know that he already has an account
          // but with a different provider, and let him validate the fact he wants to
          // sign in with this provider.
          // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
          // so in real scenario you should ask the user to click on a "continue" button
          // that will trigger the signInWithPopup.
          auth.signInWithPopup(provider).then(function(result) {
            // Remember that the user may have signed in with an account that has a different email
            // address than the first one. This can happen as Firebase doesn't control the provider's
            // sign in flow and the user is free to login using whichever account he owns.
            // Step 4b.
            // Link to Facebook credential.
            // As we have access to the pending credential, we can directly call the link method.
            result.user.linkAndRetrieveDataWithCredential(pendingCred).then(function(usercred) {
              // Facebook account successfully linked to the existing Firebase user.
              //ADD "Successfully linked" component here
            }).catch( (errorInLinking) => {
              // console.log(errorInLinking);
              this.snackBar.open( errorInLinking, 'close', {
                duration: 4000,
              });
            });
          });
      });
  }else{
    this.snackBar.open( error.message, 'close', {
      duration: 4000,
    });
  }
});

}

  signInWithGoogle() {
    var auth = firebase.auth();
    this.loginmethod = 'google.com';
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    ).then((result) => {
      this.getUserDocument(auth.currentUser.uid);
      console.log("is new user: "+ result.additionalUserInfo.isNewUser);
      if (result.additionalUserInfo.isNewUser === true){
        this.ngZone.run(() => this.router.navigate(['success']));
      }else{
        this.ngZone.run(() => this.router.navigate(['verifyemail']));
      }
    }).catch((error) => {
        // console.log("Error signing in with Google:", error.message);
        this.snackBar.open( error.message, 'close', {
          duration: 4000,
        });
    });
  }

  signInRegular(email, password) {
    var auth = firebase.auth();
    this.loginmethod = 'email';

    console.log(auth.currentUser.uid);
    this.getUserDocument(auth.currentUser.uid);
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);//then
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
  getLoginMethod(){
    return this.loginmethod;
  }
  //Get methods for firebase database info
  isNewUser(){
    return this.newuser;
  }
  getAvatar(){
    return this.avatar;
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
  // sendPasswordReset(emailadress){
  //   var user = this._firebaseAuth.auth;
  //   // var email = this.getEmail();

  //   return user.sendPasswordResetEmail(emailadress).then((res) => {
  //     // Email sent.
      
  //   }).catch(function(error) {
  //     // An error happened.
  //     console.log("Error sending reset link: "+ error.message);
  //     // return false
  //   });
  //   // return true;
  // }
  setPassword(newPassword){
    this._firebaseAuth.auth.currentUser.updatePassword(newPassword).then(function(){
      }).catch((error) =>{
        this.snackBar.open( error.message, 'close', {
          duration: 4000,
        });
      });

  }
  logout() {
    this._firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['login']));
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
      // The document probably doesn't exist.
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
      // The document probably doesn't exist.
      // console.error("Error updating document: ", error);
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
      // The document probably doesn't exist.
      // console.error("Error updating document: ", error);
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
      // The document probably doesn't exist.
      // console.error("Error updating document: ", error);
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
      // The document probably doesn't exist.
      // console.error("Error updating document: ", error);
      this.snackBar.open( error.message, 'close', {
        duration: 4000,
      });
    });
  }
}

