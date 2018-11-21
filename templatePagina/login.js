// Verify if the user is logged in 
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById("login_div").style.display = "none";
        window.location.href = "home.html"
    } else {
        document.getElementById("login_div").style.display = "block";
    }
  });

const bttnLogin= document.getElementById("btn_login");

bttnLogin.addEventListener('click', e => {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pswd_field").value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Usuario o contraseña incorrectos. "+errorMessage)
        // ...
      });
});
