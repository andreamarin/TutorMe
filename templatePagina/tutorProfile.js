var nom = document.getElementById("nombre");
var mail = document.getElementById("mail");
var carr = document.getElementById("carrera");
var mat = document.getElementById("mat");
var costo = document.getElementById("costo");
var nomSch = document.getElementById("nomSch")
var cstoS = document.getElementById("cS");
var ddl = document.getElementById("materia");
var ddl_fechas = document.getElementById("dd_fecha");
var ddl_horarios = document.getElementById("dd_horario");
var db = firebase.database();
var horarios, selectedDate;

var url = new URL(window.location);
var p = new URLSearchParams(url.search.substring(1));

var btnCita = document.getElementById('btn_cita');
var btnAgendar = document.getElementById('btn_agendar');
var dd_materias = document.getElementById('materias');

if(p.has('tutor')){
    var idT = p.get("tutor");
    load_profile(idT);
}else{
    firebase.auth().onAuthStateChanged(function(user) {
        ref = db.ref('usernames/'+user.uid);
        ref.on("value", function(snapshot){
            id = snapshot.val().username;
            load_profile(id);
        }, function(errorObject){
            console.log("The read failed: " + errorObject.code);
        });
    });
    btnAgendar.style.display = "none";
}

function load_profile(idT){
    db.ref("tutores/"+idT).on("value", function(snap){
        var user = snap.val();
        nom.innerHTML = user.nombre + nom.innerHTML; //Cambiar por nombre
        mail.innerHTML = 'Correo: '+idT+'@itam.mx' //Cambiar por correo
        carr.innerHTML =  "Carrera: " + user.carrera;
        costo.innerHTML = "$" +user.rate;

        nomSch.innerHTML = user.nombre; //Cambiar a nombre
        cstoS.innerHTML = "$" + user.rate;

        for(let m of snap.val().materias){
            db.ref("/materias/").orderByChild("id").equalTo(m).on("child_added", function(n){
                var l = document.createElement("li");
                l.innerHTML = n.val().nombre;
                mat.appendChild(l);


                var o = document.createElement("option");
                o.value = n.val().id;
                o.innerHTML = n.val().nombre;
                ddl.appendChild(o);
            });
        }

        var img_path = user.pp_path;
        if( img_path != 'none'){
            var storage = firebase.storage();
            var pathReference = storage.ref('profile_pictures/');
            var manRef = pathReference.child(user.pp_path);

            manRef.getDownloadURL().then(function(url){
                var img_holder = document.getElementById("img_holder");
                img_holder.src = url;
            });
        }

        return;
    });
}

//onclick="changeMode('scheduleApp')"
btnCita.addEventListener('click', e=>{
    var i;
    var x = document.getElementsByClassName("mode");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById('scheduleApp').style.display = "block"
    var fechas = [];

    var startDate = new Date();
    for(var i = 1; i <= 15; i++){
        var newDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()+i,
            startDate.getHours(),
            startDate.getMinutes(),
            startDate.getSeconds()
        );

        fechas.push(newDate);
    }

    for(let f of fechas){
        var options = {weekday: 'short', day:'2-digit', month:'long', year:'numeric'};
        var elem = document.createElement("option");
        elem.value = f;
        elem.text = f.toLocaleDateString('en-US', options);
        ddl_fechas.appendChild(elem);
    }
});

ddl_fechas.addEventListener('change', e => {
    db.ref('tutores/'+p.get("tutor")).on('value', function(snap){
        horarios = snap.val().horarios;

        var dia = {1: 'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 6:'Sat', 0:'Sun'};
        var dict_horarios = { 08:'8:00 - 9:00', 09:'9:00 - 10:00', 10:'10:00 - 11:00',
                        11: '11:00 - 12:00', 12:'12:00 - 13:00', 13:'13:00 - 14:00',
                        14: '14:00 - 15:00', 15:'15:00 - 16:00', 16:'16:00 - 17:00',
                        17: '17:00 - 18:00', 18:'18:00 - 19:00', 19:'19:00 - 20:00',
                        20: '20:00 - 21:00', 21:'21:00 - 22:00'};

        selectedDate = new Date(ddl_fechas.value);
        var fechaId = dia[selectedDate.getDay()];
        for(let h of horarios){
            if(h.includes(fechaId)){
                var elem = document.createElement('option');
                var key = h.replace(fechaId,"");
                key = key[0]=='0' ? key[1] : key;
                elem.value = dict_horarios[key];
                elem.text = dict_horarios[key];
                ddl_horarios.appendChild(elem);
            }
        }
    });
});


btnAgendar.addEventListener('click', e => {
    db.ref('sesiones/').once('value', function(snap){
        var id = snap.numChildren();
        console.log(id);
        upload_sesion(id);
    });
});

function upload_sesion(sesId){
    db.ref('sesiones/'+sesId).set({
        idTutor: p.get('tutor'),
        uidAlumno: firebase.auth().currentUser.uid,
        materia: ddl.value,
        fecha: new Date(document.getElementById('dd_fecha').value),
        horario: document.getElementById('dd_horario').value,
        aceptada: 0
    });
}
