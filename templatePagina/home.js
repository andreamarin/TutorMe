const btnLogout = document.getElementById("btn_logout");

btnLogout.addEventListener('click', e=> {
    firebase.auth().signOut();
    window.location.href = "login.html"
})