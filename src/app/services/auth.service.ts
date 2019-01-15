import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore,  } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { yearsPerPage } from '@angular/material/datepicker/typings/multi-year-view';

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
    // private fba : firebase,
  ) { 
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
      if (user) {
        
        this.userDetails = user;
        this.profilePhoto = this.userDetails.photoURL;
        // console.log(this.profilePhoto);
        this.displayName = this.userDetails.displayName;
        // console.log(this.displayName);
        this.providerId = this.userDetails.providerId;
        // console.log( this.providerId);
        this.displayEmail = this.userDetails.email;
      }
      else {
        this.userDetails = null;
      }
      }
    );
    
  }
  ngOnInit(){

  }
  
  // Use fat arrow for linked functions, able to access class methods inside
  getUserDocument(uid){
    var userdoc;//, tempav, tempus, tempne;

    this.userloggedin = this.db.collection("users").doc(uid);
    this.userloggedin.get().then((doc) => {
      if (doc.exists) {
        userdoc = doc.data();
        // tempav = userdoc.avatar;
        // tempus = userdoc.username;
        // tempne = userdoc.newuser;
        this.avatar = userdoc.avatar;
        this.email = userdoc.email;
        this.favourites = userdoc.favourites;
        this.history = userdoc.history;
        this.newuser = userdoc.newuser;
        this.username = userdoc.username;
        this.verified = userdoc.verified;
        
      } else {
          console.log("No such document!");
          //addDocument(docname,username, email, avatar,verified,newuser,favourites,history)
          this.addDocument(uid,'',this.displayEmail, this.profilePhoto, 'false', 'true','','');
          return false;
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
  return true;
  }

  //Adds entry to 'users' collection
  addDocument(docname,username, email, avatar,verified,newuser,favourites,history){
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
      .catch(function(error) {
          console.error("Error creating user account: ", error);
      });
  }

  createAccount(email, password){
    this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
      var errorMessage = error.message;
      console.log("Error creating account:", errorMessage)
      return false;
    });
      return true;
  }

  login(loginmethod, email, password){
    console.log(loginmethod);
     if (loginmethod == 'facebook.com'){
      this.signInWithFacebook().then((res) => {
        // this.ngZone.run(() => this.router.navigate(['success']));
      })
      .catch((err) => console.log(err));
     } else if (loginmethod == 'google.com'){
       this.signInWithGoogle().then((res) => {
        // this.ngZone.run(() => this.router.navigate(['success']));
      })
      .catch((err) => console.log(err));
    } else if (loginmethod == 'email'){
      this.signInRegular(email,password).then((res) => {
        // this.ngZone.run(() => this.router.navigate(['success']));
      })
      .catch((err) => console.log(err));
      }else if (loginmethod == 'intra.42.fr'){
        this.signInWith42()
      /*.then((res) => {
        this.getUserDocument();
        this.ngZone.run(() => this.router.navigate(['setpass']));
        })
      .catch((err) => console.log(err));
      */
    }

  }
  signInWith42(){
    window.alert("Need to link the API");
  }

  signInWithFacebook() {

    var auth = firebase.auth();
    this.loginmethod = 'facebook.com';
    return auth.signInWithPopup(
          new firebase.auth.FacebookAuthProvider()
    ).then((result) => {
      console.log(auth.currentUser.uid);
      this.getUserDocument(auth.currentUser.uid);
      console.log("is new user: "+ result.additionalUserInfo.isNewUser);
      if (result.additionalUserInfo.isNewUser === true){
        this.ngZone.run(() => this.router.navigate(['success']));
      }else{
        this.ngZone.run(() => this.router.navigate(['verifyemail']));
      }
    }).catch(function(error) {
      
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
              console.log("facebook account successfully linked!");
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
              console.log(errorInLinking);
            });
          });
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
    }).catch(function(error) {
        console.log("Error signing in with Google:", error.message);
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
    }).catch(function(error) {
      // An error happened.
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
      }).catch(function(error) {

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
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }
  updateEmail(info){
    return this.userloggedin.update({
      email: info
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }
  updateFavourites(info){
    return this.userloggedin.update({
      favourites: info
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
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
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }
  updateUsername(info){
    return this.userloggedin.update({
      username: info
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }
  updateVerified(info){
    return this.userloggedin.update({
      verified: info
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }
}

