(function() {
    const config = {
        apiKey: "AIzaSyBsRQLAHqwZ8GGn4ZOYwMuN-Rt412Evf5c",
        authDomain: "tutorme-9b2cb.firebaseapp.com",
        databaseURL: "https://tutorme-9b2cb.firebaseio.com",
        projectId: "tutorme-9b2cb",
        storageBucket: "tutorme-9b2cb.appspot.com",
        messagingSenderId: "616196369980"
    };
    firebase.initializeApp(config);
    // Get elements
    const user = document.getElementById("usr_field").value;
    const email = document.getElementById("email_field").value;
    const pswd = document.getElementById("pswd_field").value;
    const pswd2 = document.getElementById("pswd2_field").value;
    const carrera = document.getElementById("carrera_field").value;
    const cu = document.getElementById("cu_field").value; 

    const btnConfirm = document.getElementById("btn_confirm");
    const btnCancel = document.getElementById("btn_cancel");

    btnCancel.addEventListener('click', e =>{
        window.alert("adios");
        window.location.href = "login.html";
    });

    btnConfirm.addEventListener('click', e => {
        window.alert("click!")
    
    
        if (user == "" || email == "" || pswd == "" || pswd2 == ""
            || carrera == "" || cu == ""){
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
    
        const promise = firebase.auth().createUserWithEmailAndPassword(email, pswd);
        promise
            .then(user => {
                window.alert("Registro existoso.")
                //user.sendEmailVerification().then(window.alert("Verifica tu correo"))
            })
            .catch(e => window.alert("Ha ocurrido un error, intenta de nuevo. "+e.message));
    });    
    
}());





function upload(){
    window.alert("Registro exitoso");
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        window.location.href = "home.html"
    } else {
    }
  });

