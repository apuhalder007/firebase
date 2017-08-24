
var form_user;
var config = {
    apiKey: "AIzaSyALvY_vlb3x0JFTgGI0912lXXW78vI2N_8",
    authDomain: "todoapp-9a26f.firebaseapp.com",
    databaseURL: "https://todoapp-9a26f.firebaseio.com",
    projectId: "todoapp-9a26f",
    storageBucket: "todoapp-9a26f.appspot.com",
    messagingSenderId: "388119669974"
    };

firebase.initializeApp(config);
var auth = firebase.auth();
var dbRef = firebase.database().ref();
var dbRefTasks = dbRef.child('tasks');
var dbRefUsers = dbRef.child('users');

var message = document.getElementById('message');
var listUsers = document.getElementById('listUsers');
var signOutBtn = document.getElementById('sign-out');
signOutBtn.addEventListener('click', onSignOut);
var usersEle = $('.users');
var signOutEle = $('#sign-out');
var signUpEle = $('.sign-up');
var signInEle = $('.sign-in');

checkUser();

function onSignUp(_this){
    var email =  _this[0];
    var password =  _this[1];
    if(email.value ==''){
        email.classList.add('error');
        return false
    }else{
        email.classList.remove('error');
    }

    if(password.value ==''){
        password.classList.add('error');
        return false
    }else{
        password.classList.remove('error');
    }
    userRegistration(email.value, password.value);
    return false; //don't submit
    }

function onSignIn(_this){
    var email =  _this[0];
    var password =  _this[1];
    if(email.value ==''){
        email.classList.add('error');
        return false
    }else{
        email.classList.remove('error');
    }

    if(password.value ==''){
        password.classList.add('error');
        return false
    }else{
        password.classList.remove('error');
    }
    userLogin(email.value, password.value);
    return false;
}

function onSignOut(){
    auth.signOut()
    .then(function() {
        // Sign-out successful.
        unsetUser();
        checkUser();
        listUsers.innerHTML = '';
    }).catch(function(error) {
        // An error happened.
    });
}

function userRegistration(email, password){
    auth.createUserWithEmailAndPassword(email, password)
    .then(function(response){
        console.log(response);
        setUserId(response);
        saveUser(response.uid, email, true, true)
        showMessage('success', "User has been successfully register");
        email = '';
        password= '';

    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      showMessage('danger', errorMessage);
    });

}


function saveUser(user_id, email, status, online){
    var updates = {};
    updates['users/'+user_id] = {"email":email, "status":status, "online":online};
    dbRef.update(updates);
}

function userLogin(email, password){
    auth.signInWithEmailAndPassword(email, password)
    .then(function(response){
        console.log(response);
        showMessage('success', "User successfully login");
        setUserId(response);
        checkUser();

    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        showMessage('danger', errorMessage);
    });

}

function showMessage(type, msg){
    var msg =  `<div class="alert alert-${type} alert-dismissable">
            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
            ${msg}
        </div>`;
    message.innerHTML = msg;
}

function userList(){
    dbRefUsers.on('child_added', snap=>{
        console.log(snap.val());
        var li = document.createElement('li');
        li.innerText = snap.child("email").val();
        li.id = snap.key;
        listUsers.appendChild(li);

    });

    dbRefUsers.on('child_changed', snap=>{
        var liChanged = document.getElementById(snap.key);
        liChanged.innerText = snap.child('email').val();
    
    });

    dbRefUsers.on('child_removed', snap=>{
        var liToRemoved = document.getElementById(snap.key);
        liToRemoved.remove();
    }); 
}


function setUserId(userObject){
    window.localStorage.setItem('currentUserId', userObject.uid);
}

function getUserId(){
    return window.localStorage.getItem('currentUserId');
}
function unsetUser(){
    window.localStorage.removeItem('currentUserId');
}

function checkUser(){
    if(getUserId()){
        usersEle.show();
        signOutEle.show();
        signUpEle.hide();
        signInEle.hide();    
        usersEle.trigger('click');
        userList();

    }else{
        signUpEle.show();
        signInEle.show();
        usersEle.hide();
        signOutEle.hide();
        signInEle.trigger('click');
    }
}


    
