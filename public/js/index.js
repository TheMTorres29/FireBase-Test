firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){
      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "Welcome " + email_id;
    }

  } else {
    // No user is signed in.
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
  }
});

function login(){
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;

  window.alert("Error : " + errorMessage)
});
}

function signUp(){
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;

  window.alert("Error : " + errorMessage)
});
}

function logout(){
  firebase.auth().signOut();//.then(function() {
    // Sign-out successful.
  //}).catch(function(error) {
    // An error happened.
  //});
}

// JS from FireStore tutorial
const pokemonGameList = document.querySelector('#gameList');
const form = document.querySelector('#addGameForm');

// create element and render games
function renderGame(doc){
  let li = document.createElement('li');
  let gameTitle = document.createElement('span')
  let gameConsole = document.createElement('span')
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  gameTitle.textContent = doc.data().title;
  gameConsole.textContent = doc.data().gConsole;
  cross.textContent = 'Delete';

  li.appendChild(gameTitle);
  li.appendChild(gameConsole);
  li.appendChild(cross);

  gameList.appendChild(li);

  // deleting data
  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('pokemonGames').doc(id).delete();
  })
}

// getting data
// db.collection('pokemonGames').orderBy('title').get().then((snapshot) => {
//   snapshot.docs.forEach(doc => {
//     renderGame(doc);
//   })
// })

//saving data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('pokemonGames').add({
    title: form.title.value,
    gConsole: form.gConsole.value
  });
  form.title.value = '';
  form.gConsole.value = '';
})

// real-time listner
db.collection('pokemonGames').orderBy('title').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if(change.type == 'added'){
      renderGame(change.doc);
    }
    else if(change.type == 'removed'){
      let li = gameList.querySelector('[data-id=' + change.doc.id + ']');
      gameList.removeChild(li);
    }
  });

})
