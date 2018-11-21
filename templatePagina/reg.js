var btnCancel, btnConfirm;
var user, email, pswd, pswd2, carrera, cu;
var db;
(function() {

    // Get elements
    btnConfirm = document.getElementById("btn_confirm");
    btnCancel = document.getElementById("btn_cancel");
    db = firebase.database();

}());

function get_elements(){
    user = document.getElementById("usr_field").value;
    email = document.getElementById("email_field").value;
    pswd = document.getElementById("pswd_field").value;
    pswd2 = document.getElementById("pswd2_field").value;
    carrera_ = document.getElementById("carrera_field").value;
    cu = document.getElementById("cu_field").value; 
}

btnConfirm.addEventListener('click', e => {
    get_elements();

    if (user == "" || email == "" || pswd == "" || pswd2 == ""
        || carrera_ == "" || cu == ""){
            window.alert("¡Debes llenar todos los campos!");
            return;
    }
    /*
    if(!email.includes("@itam")){
        window.alert("Debes ingresar tu correo del ITAM");
        return;
    }
    */
    
    if(pswd != pswd2){
        window.alert("Las contraseñas no coinciden");
        return;
    }

    if(pswd.length < 6){
        window.alert("La contraseña debe contener al menos 6 caracteres");
        return;
    }

    const promise = firebase.auth().createUserWithEmailAndPassword(email, pswd);
    promise
        .then(user => {
            /*
            var usr = firebase.auth().currentUser;
            usr.sendEmailVerification().then(function() {
                window.alert("Checa tu correo.")
            }).catch(function(error) {
                window.alert(error.message);
            });
            */
        })
        .catch(e => window.alert("Ha ocurrido un error, intenta de nuevo. "+e.message));
});

btnCancel.addEventListener('click', e => {
    window.location.href = "login.html";
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        upload();
    } else {
    }
});

function upload(){
    var usr = firebase.auth().currentUser;
    var uid = usr.uid;

    db.ref('users/'+uid).set({
        username: user,
        carrera: carrera_,
        clave_unica: cu
    });

    window.alert("Registro existoso.");
}
