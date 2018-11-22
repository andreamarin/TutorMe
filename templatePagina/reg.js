var btnCancel, btnConfirm;
var user, email, pswd, pswd2, carrera, cu;
var db;
(function() {

    // Get elements
    btnConfirm = document.getElementById("btn_confirm");
    btnCancel = document.getElementById("btn_cancel");
    db = firebase.database();

}());

//Saca el catalogo de materias y lo guarda en una variable
var catalogoMaterias = [];

var matRef = db.ref("materias");
matRef.on("value", function(snapshot){
  catalogoMaterias = snapshot.val();
}, function(errorObject){
  console.log("Read fail: " + errorObject.code)
});

var totMat=1;
  
var hours=["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"];
var days=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

var tab = document.getElementById("schTable");
var row, col, t;

for(i=0; i<14; i++){
  row = document.createElement("tr");
  row.id = "at"+hours[i];
  row.className = "w3-white";
  col =  document.createElement("td");
  
  col.style.borderRight = "1px grey solid";
  t = document.createTextNode(hours[i]+":00 - "+hours[i+1]+":00");
  col.appendChild(t);
  row.appendChild(col);
  for(j=0; j<7; j++){
    col =  document.createElement("td");

    col.className = "w3-btn w3-white w3-border";
    
    col.id = hours[i]+days[j];
    col.setAttribute("active", "0");
    col.setAttribute("onclick", "schToggle(this.id)");

    row.appendChild(col);
  }
  tab.appendChild(row);
}



function toggle(modeid) {
    
    var x = document.getElementById(modeid);
    if(x.style.display == "none"){
        x.style.display = "block";
    }else{
        x.style.display = "none";
    }
}

function addMat(){
    var mat = document.createElement("select");
    mat.style.padding = "3px";
    mat.style.width = "60%";
    mat.style.margin = "3px";
    mat.id = "materia"+ (totMat++);
    
    for(i = 0; i < catalogoMaterias.length; i++){
        var elem = document.createElement("option");
        elem.value = catalogoMaterias[i].id;
        elem.text = catalogoMaterias[i].nombre;
        mat.appendChild(elem);
    }
    
    document.getElementById("materias").appendChild(mat);

}

function removeMat(){
    if(totMat>1){
        document.getElementById("materia"+ (--totMat)).remove();
    }
}

function schToggle(id){
  var x = document.getElementById(id);
  var i = x.className.indexOf("w3-white");
  if(i == -1){
    x.className = x.className.replace("w3-light-blue", "w3-white");
    x.setAttribute("active", "0");
  }else{
    x.className = x.className.replace("w3-white", "w3-light-blue");
    x.setAttribute("active", "1");
  }
}


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
