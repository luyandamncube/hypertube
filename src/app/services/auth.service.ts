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
    var userdoc, tempav, tempus, tempne;

    this.userloggedin = this.db.collection("users").doc(uid);
    this.userloggedin.get().then((doc) => {
      if (doc.exists) {
        userdoc = doc.data();

        if (userdoc.newuser  == '' || userdoc.newuser == 'true'){
          // console.log("New user");
          tempav = this.profilePhoto;
          tempus = this.displayName;
          tempne = 'false';
          this.updateAvatar(tempav);
          // this.updateUsername(tempus.toLowerCase( ));
          this.updateNewuser(tempne);
        }else{
          tempav = userdoc.avatar;
          tempus = userdoc.username;
          tempne = userdoc.newuser;
        }
        this.avatar = tempav;
        this.email = userdoc.email;
        this.favourites = userdoc.favourites;
        this.history = userdoc.history;
        this.newuser = tempne;
        this.username = tempus;
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
      //.then((doc) => 
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
    console.log('method: '+loginmethod+ ' email: '+email+' password: '+password);
     if (loginmethod == 'facebook.com'){
      this.signInWithFacebook().then((res) => {
        this.ngZone.run(() => this.router.navigate(['setpass']));
      })
      .catch((err) => console.log(err));
      console.log('logged in with fb');
    }else if (loginmethod == 'google.com'){
      this.signInWithGoogle().then((res) => {
        console.log(this.newuser);
        if (this.newuser == 'false'){
          this.ngZone.run(() => this.router.navigate(['setpass']));
          console.log('existing user');
        }
          
        else{
          this.ngZone.run(() => this.router.navigate(['login']));
          console.log('new user');
        }

        })
      .catch((err) => console.log(err));
      console.log('logged in with google');
    }else if (loginmethod == 'email'){
      this.signInRegular(email,password).then((res) => {
        this.ngZone.run(() => this.router.navigate(['setpass']));
        })
      .catch((err) => console.log(err));
      console.log('logged in with email');
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
    // this.getUserDocument();
    window.alert("Need to link the API");
  }

  signInWithFacebook() {
    // this.getUserDocument();
    // var zone = this.ngZone;
    // var route = this.router;
    var auth = firebase.auth();
    // var user = firebase.auth().currentUser;
    
    this.loginmethod = 'facebook.com';
    return auth.signInWithPopup(
          new firebase.auth.FacebookAuthProvider()
          ////.then((doc) => 
    ).then((result) => {
      console.log(auth.currentUser.uid);
      this.getUserDocument(auth.currentUser.uid)
      // this.ngZone.run(() => this.router.navigate(['setpass']));
      // console.log('worked!')
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
  // getLoggedIn(){
  //   return this.db.collection("users").doc(this.uid);
  // }
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
  //Update methods
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

