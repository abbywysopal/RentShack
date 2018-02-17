'use strict';


var messageForm = document.getElementById('messageForm'); //IMPLEMENTED IN HTML
var titlePost = document.getElementById("titlePost"); //IMPLEMENTED IN HTML
/*var pricePerHour = document.getElementById('pricePerHour');*/ //IMPLEMENTED IN HTML
var itemDescription = document.getElementById('itemDescription'); //IMPLEMENTED IN HTML
/*var submit = document.getElementById('submit');*/ //IMPLEMENTED IN HTML
/*var itemCondition = document.getElementById('inlineRadio1');*/ //IMPLEMENTED IN HTML
/*var fileUpload = document.getElementById('exampleInputFile');*/ //IMPLEMENTED IN HTML

var listeningFirebaseRefs = [];



function writeNewPost(uid, email, titlePost, itemDescription) {
  // A post entry.
  var postData = {
    uid: uid,
	email: email,
	itemDescription: itemDescription,
    titlePost: titlePost
    //starCount: 0, PERHAPS ADD ITEMAVALIABILITY VARIABLE??? 
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}


function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}
  
  var currentUID;

  
function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  //cleanupUi();
  if (user) {
	  console.log('this is inside main.js');
	  console.log(user);

    currentUID = user.uid;
    //splashPage.style.display = 'none';
    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    //startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;
    // Display the splash page where you can sign-in.
    //splashPage.style.display = '';
  }
}


function newPostForCurrentUser(titlePost, itemDescription) {
  // [START single_value_read]
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // [START_EXCLUDE]
    return writeNewPost(firebase.auth().currentUser.uid, firebase.auth().currentUser.email,
        titlePost, itemDescription);
    // [END_EXCLUDE]
  });
  // [END single_value_read]
}


window.addEventListener('load', function() {
  // Bind Sign in button.
 /* signInButton.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }); */

  // Bind Sign out button.
 /* signOutButton.addEventListener('click', function() {
    firebase.auth().signOut();
  }); */

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  // Saves message on form submit.
  messageForm.onsubmit = function(e) {
    e.preventDefault();
    //var text = messageInput.value;
    //var title = titleInput.value;
	var title = titlePost.value;
	//var pricePerHour = pricePerHour.value;
	var description = itemDescription.value;
	//var condition = itemCondition.value;
	//var upload = fileUpload.value;
	
    //if (text && title) {
	  if ( title && description) {
      newPostForCurrentUser(title, description).then(function() {
       // myPostsMenuButton.click();
      });
      titlePost.value = '';
	  itemDescription.value = '';

    }
  };
}, false);



