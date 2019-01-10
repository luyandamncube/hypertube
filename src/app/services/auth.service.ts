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
  public userDocument = null;

  db = firebase.firestore();
  colelction  = this.db.collection("users");
  loginmethod = '';
  //User info from Observable
  uid: string;
	profilePhoto: string;
	displayName: string;
  providerId: string;
  
  //User info from db
  avatar= null;   
  email= null;    
  favourites= null;  
  history= null;  
  newuser= null;  
  username= null;  
  verified= null;  

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
        // console.log(user);
        this.uid = this.userDetails.uid;
        // console.log(this.uid);
        this.profilePhoto= this.userDetails.photoURL;
        // console.log(this.profilePhoto);
        this.displayName = this.userDetails.displayName;
        // console.log(this.displayName);
        this.providerId= this.userDetails.providerId;
        // console.log( this.providerId);
      }
      else {
        this.userDetails = null;
      }
      }
    );
  }

  getUserDocument(){
    // console.log(this.uid);
    var userdoc, avatar, email, favourites, history, newuser, username, verified ;
    this.userloggedin = this.db.collection("users").doc(this.uid);
    this.userloggedin.get().then(function(doc) {
      if (doc.exists) {
        userdoc = doc.data();
        console.log("Document data:", userdoc);
        // return userdoc;
        // console.log(this.userDocument);
        // avatar = userdoc['avatar'];
        // email = userdoc.email;
        // favourites = userdoc.favourites;
        // history = userdoc.history;
        // newuser = userdoc.newuser;
        // username = userdoc.username;
        // verified = userdoc.verified;
      } else {
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
    // console.log(this.userDocument);
    // this.avatar = this.userDocument.avatar; console.log(this.avatar);
    // this.email = this.userDocument.email;console.log(this.email);
    // this.favourites = this.userDocument.favourites;console.log(this.favourites);
    // this.history = this.userDocument.history;console.log(this.history);
    // this.newuser = this.userDocument.newuser;console.log(this.newuser);
    // this.username = this.userDocument.username;console.log(this.username);
    // this.verified = this.userDocument.verified;console.log(this.verified);
  }
  //Adds entry to 'users' collection
  addDocument(docname,username, email, avatar,verified,favourites,history){
        console.log("user ID found: "+ docname);
        // Add a new user account in collections
        this.afs.collection("users").doc(docname).set({
          username: username,
          email: email,
          avatar: avatar,
          verified: verified,
          newuser: 'yes',
          favourites: favourites,
          history: history,
      })
      .then(function() {
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

  signInWith42(){
    // this.getUserDocument();
    window.alert("Need to link the API")
  }

  signInWithFacebook() {
    // this.getUserDocument();
    var zone = this.ngZone;
    var route = this.router;
    var auth = firebase.auth();
    var user = firebase.auth().currentUser;
    
    this.loginmethod = 'facebook.com';
    return auth.signInWithPopup(
          new firebase.auth.FacebookAuthProvider()
    ).then(function(result) {
      
      if(result.additionalUserInfo.isNewUser){
        zone.run(() => route.navigate(['setpass']));
        console.log("existing user")
      }else{
        console.log("new user");
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
    // this.getUserDocument();
    this.loginmethod = 'google.com';
    var zone = this.ngZone;
    var route = this.router;
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    ).then(function(result) {
    }).catch(function(error) {
        console.log("Error signing in with Google:", error.message);
    });
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
    // this.getUserDocument();
    this.loginmethod = 'email';
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);//then
  }
  //Get methods for user info
  getUsername(){
    return this.userDetails.displayName;
  }
  getUserID(){
    return this.userDetails.uid
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
  sendPasswordReset(){
    var user = this._firebaseAuth.auth;
    var email = this.getEmail();

    user.sendPasswordResetEmail(email).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });

  }
  setPassword(newPassword){
    this._firebaseAuth.auth.currentUser.updatePassword(newPassword).then(function(){
      }).catch(function(error) {

      });

  }
  logout() {
    this._firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['login']));
  }

}

