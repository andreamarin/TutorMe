var btnCancel, btnConfirm;
var user, email, pswd, pswd2, carrera, cu, username;
var db;
var tutor, precio;
var materias = [];
var horarios = [];

(function() {
    // Get elements
    btnConfirm = document.getElementById("btn_confirm");
    btnCancel = document.getElementById("btn_cancel");
    ifTutor = document.getElementById("ifTutor");

    db = firebase.database();

}());

function get_elements(){
    user = document.getElementById("usr_field").value;
    email = document.getElementById("email_field").value;
    pswd = document.getElementById("pswd_field").value;
    pswd2 = document.getElementById("pswd2_field").value;
    carrera = document.getElementById("carrera_field").value;
    cu = document.getElementById("cu_field").value; 
    username = email.split("@")[0];

    tutor = ifTutor.style.display === "block";
    var horas = ["08","09","10","11","12","13","14","15","16","17","18","19","20", "21"];
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    if(tutor){
        precio = document.getElementById("rate").value;
        var mat_dd = document.getElementById("materia0");
        var i = 0;
        do{
            materias.push(mat_dd.options[mat_dd.selectedIndex].value);
            i++;
            mat_dd = document.getElementById("materia"+i);
        }while(mat_dd != null);

        var h;
        days.forEach(function(day) {
            horas.forEach(function(hrs){
                horario = hrs+day;
                h = document.getElementById(horario).getAttribute('active');
                if(h === "1"){
                    horarios.push(horario);
                }
            });
        });
    }
}

btnConfirm.addEventListener('click', e => {
    get_elements();

    if (user == "" || email == "" || pswd == "" || pswd2 == ""
        || carrera == "" || cu == ""){
            if(tutor && (materias == [] || horarios == [] || precio == "")){
                window.alert("Debes llenar todos los campos.");
                return;
            }else{
                window.alert("Debes llenar todos los campos.");
                return;
            }
    }
    
    if(!email.includes("@itam")){
        window.alert("Debes ingresar tu correo del ITAM");
        return;
    }
    
    if(cu.length != 9){
        window.alert("Tu clave única debe tener 9 dígitos.");
    }

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
    window.location.href = "index.html";
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        upload();
    }
});

function upload(){
    var usr = firebase.auth().currentUser;
    var uid = usr.uid;
    
    if(tutor){
        db.ref('tutores/'+username).set({
            nombre: user,
            carrera: carrera,
            clave_unica: cu,
            rate: precio,
            materias: materias,
            horarios: horarios,
            username: username
        });
    }else{
        db.ref('alumnos/'+username).set({
            nombre: user,
            username: username,
            carrera: carrera,
            clave_unica: cu
        });
    }  
    
    db.ref('usernames/'+uid).set({
        username: username
    });

    window.alert("Registro existoso.");
    window.location.href = "index.html";
}
