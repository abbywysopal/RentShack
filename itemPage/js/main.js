'use strict';


var titlePost = document.getElementById('titlePost');
var itemDescription = document.getElementById('itemDescription');

var messageForm = document.getElementById('messageForm');
var comment = document.getElementById('userComment');

var playersRef = firebase.database().ref("/posts");

var global_pid;

playersRef.on("child_added", function(data, prevChildKey) {
   var user = data.val();
   console.log("title: " + user.titlePost);
   console.log("description: " + user.itemDescription);

});

function slicePID() {
    var currentURL = window.location.href;
	var index = currentURL.indexOf("=" , 0) + 1;
	
	var pid = "";
	for(var i = index; i < currentURL.length; i++)
	{
			
		pid += currentURL.charAt(i);
		console.log(pid);

	}
	global_pid = pid;
	return pid;
}


function populatePost( pid ) {
	
	return firebase.database().ref('/posts/' + pid).once('value').then(function(snapshot) {
  			var titlePost = (snapshot.val() && snapshot.val().titlePost);
			var itemDescription = (snapshot.val() && snapshot.val().itemDescription);
			var pricePerHour = (snapshot.val() && snapshot.val().pricePerHour);
			var postPicture  = (snapshot.val() && snapshot.val().imageURL);
			if(titlePost)
			{
				document.getElementById('postTitle').innerHTML = titlePost;
				document.getElementById('postPrice').innerHTML = "$" + pricePerHour + " /hour";
				document.getElementById('postDescription').innerHTML = itemDescription;
				document.getElementById('postPicture').src = postPicture;
			}else {
 				window.location.replace("../profilePage/profilePage.html");
			}
  			/*document.getElementById('username').innerHTML = username;
			document.getElementById('profilePic').src = (snapshot.val() && snapshot.val().profilePic);*/

		  });		
	
	
}

function showComment(){
	var x = document.getElementById("commentForm");
    if (x.style.display === "none") {
        x.style.display = "block";
		window.scrollBy(0,200);
	}
}


function writeNewComment(uid, username, profilePic, pid, comment) {


  // Get a key for a new Post.
  var newCommentKey = firebase.database().ref().child('posts/' + pid).push().key;
  
	// A post entry.
  var commentData = {
    uid: uid,
	cid: newCommentKey,
	username: username,
	profilePic: profilePic,
	comment: comment
    //starCount: 0, PERHAPS ADD ITEMAVALIABILITY VARIABLE??? 
  };
  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + pid + '/post-comments/' + newCommentKey] = commentData;

  return firebase.database().ref().update(updates);
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
    //writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    //startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;
    // Display the splash page where you can sign-in.
    //splashPage.style.display = '';
  }
}

function newCommentForCurrentUser(comment) {
  // [START single_value_read]
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
	var profilePic = (snapshot.val() && snapshot.val().profilePic)
    // [START_EXCLUDE]
    return writeNewComment(firebase.auth().currentUser.uid, username, profilePic, global_pid, comment);
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
	var commentVar = comment.value;
	//var price = pricePerHour.value;
	//var description = itemDescription.value;
	//var condition = itemCondition.value;
	//var upload = fileUpload.value;
	
    //if (text && title) {
	  if ( commentVar ) {
      newCommentForCurrentUser(commentVar).then(function() {
       // myPostsMenuButton.click();
      });
      comment.value = '';

    }
  };
}, false);




window.onload = function() {
	var pid = slicePID();
	
	populatePost(pid);
};

