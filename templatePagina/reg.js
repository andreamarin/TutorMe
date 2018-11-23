var btnCancel, btnConfirm, btnUpload;
var user, email, pswd, pswd2, carrera, cu, username, file;
var db;
var tutor, precio;
var materias = [];
var horarios = [];

(function() {
    // Get elements
    btnConfirm = document.getElementById("btn_confirm");
    btnCancel = document.getElementById("btn_cancel");
    btnUpload = document.getElementById("btn_upload");
    ifTutor = document.getElementById("ifTutor");

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
    carrera = document.getElementById("carrera_field").value;
    cu = document.getElementById("cu_field").value; 
    username = email.split("@")[0];

    tutor = ifTutor.style.display === "block";
    //var horas = ["08","09","10","11","12","13","14","15","16","17","18","19","20", "21"];
    //var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
            hours.forEach(function(hrs){
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
    
    if(!(/^\w+@itam\.mx$/i.test(email))){
    //if(!email.includes('@itam.mx')){
        window.alert("Debes ingresar un correo válido del ITAM");
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
            upload();
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

btnUpload.addEventListener('change', e => {
    // Get file
    file = e.target.files[0];
});

function upload(){
    if(file){
        // Upload profile picture
        var aux = (file.name).split('.');
        var extension = aux[aux.length-1];
        var filename = username+'.'+extension;
        console.log(filename);
    
        var storageRef = firebase.storage().ref('profile_pictures/'+filename);
        const task = storageRef.put(file);
        task.then(e => {
            upload_db(filename);
        })
        .catch(err => {
            console.log(err.message) });
    }else{
        upload_db('none');
    }
}

function upload_db(filename){
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
            username: username,
            pp_path: filename
        });
    }else{
        db.ref('alumnos/'+username).set({
            nombre: user,
            username: username,
            carrera: carrera,
            clave_unica: cu,
            pp_path: filename
        });
    }  
    
    var val_tutor = tutor ? 1:0;

    db.ref('usernames/'+uid).set({
        username: username,
        esTutor: val_tutor
    });

    window.alert('Registro exitoso');
    window.location.href = 'index.html';
}
