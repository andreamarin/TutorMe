function register(){
    var user = document.getElementById("usr_field").value;
    var email = document.getElementById("email_field").value;
    var pswd = document.getElementById("pswd_field").value;
    var pswd2 = document.getElementById("pswd2_field").value;
    var carrera = document.getElementById("pswd2_field").value;
    var cu = document.getElementById("cu_field").value;

    if(!email.contains("@itam")){
        window.alert("Debes ingresar tu correo del ITAM");
        return;
    }

    if(!pswd == pswd2){
        window.alert("Las contraseñas no coinciden");
        return; 
    }
}