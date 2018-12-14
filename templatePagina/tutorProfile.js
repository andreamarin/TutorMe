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
var reviews_table = document.getElementById("reviews");
var db = firebase.database();
var ref_horarios = {'Mon':[], 'Tue':[], 'Wed':[], 'Thu':[], 'Fri':[], 'Sat':[], 'Sun':[]};
var btnEscribir = document.getElementById('btn_escribir');
var writeZ = document.getElementById("write");
var writeZone = document.getElementById("writeZone");
var url = new URL(window.location);
var p = new URLSearchParams(url.search.substring(1));
var color = {};
var resenas = [];

var btnCita = document.getElementById('btn_cita');
var btnMsj = document.getElementById('btn_mensaje');
var btnAgendar = document.getElementById('btn_agendar');
var btnEditar = document.getElementById('btn_editar');
var dd_materias = document.getElementById('materias');

var hours=["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"];
var days=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

var tab = document.getElementById("schTable");
var row, col, t;
var tutorUsername;

// Sidebar elements
var menu_name = document.getElementById("menu_name");
var btnLogout = document.getElementById('btn_logout');
var btnProfile = document.getElementById('btn_profile');
var table_name;

btnLogout.addEventListener('click', e=> {
    firebase.auth().signOut();
    window.location.href = "index.html"
});


firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      uid = user.uid;

      db.ref('usernames/'+uid).once('value', function(snap){
        console.log(snap.val());
        var username = snap.val().username;
        var estutor = snap.val().esTutor;
        

        if(estutor === 1){
            btnProfile.href = 'tutorProfile.html';
            
            btnCita.style.display = "none";
            tutor = true;
            table_name = 'tutores';
        }else{
            btnProfile.href = 'profile.html';
            table_name = 'alumnos';
        }
        console.log(table_name);
        db.ref(table_name+'/'+username).on('value', function(snap){
            //color['c1'] = snap.val().color1;
            //color['c2'] = snap.val().color2;
            //color['bw1'] = snap.val().bw1;
            //color['bw2'] = snap.val().bw2;
            console.log(snap.val());
            menu_name.innerHTML = snap.val().nombre.split(" ")[0];
            var img_path = snap.val().pp_path;
            console.log(img_path);
            if( img_path != 'none'){
                var storage = firebase.storage();
                var pathreference = storage.ref('profile_pictures/');
                var manref = pathreference.child(img_path);
                manref.getDownloadURL().then(function(url){
                    var menu_pp = document.getElementById("menu_pp");
                    menu_pp.src = url;
                });
            }
        });

      });
    }
  });

// profile elements
for(i=0; i<14; i++){
  row = document.createElement("tr");
  row.id = "at"+hours[i];
  row.style = "background-color:white";
  col =  document.createElement("td");

  col.style.borderRight = "1px grey solid";
  t = document.createTextNode(hours[i]+":00 - "+hours[i+1]+":00");
  col.appendChild(t);
  row.appendChild(col);
  for(j=0; j<7; j++){
    col =  document.createElement("td");
    col.className = "w3-border";
    col.style = "background-color:white";
    col.id = hours[i]+days[j];
    row.appendChild(col);
  }
  tab.appendChild(row);
}

if(p.has('tutor')){
    var idT = p.get("tutor");
    load_profile(idT);
}else{
    btnEscribir.style.display = "none";
    firebase.auth().onAuthStateChanged(function(user) {
        ref = db.ref('usernames/'+user.uid);
        ref.on("value", function(snapshot){
            id = snapshot.val().username;
            load_profile(id);
        }, function(errorObject){
            console.log("The read failed: " + errorObject.code);
        });
    });

    btnMsj.style.display = "none";
    btnAgendar.style.display = "none";
    btnCita.style.display = "none";
    btnEditar.style.display = "block";
}

function load_profile(idT){

    loadRevs(idT);
    db.ref("tutores/"+idT).on("value", function(snap){
        console.log("id tutor:");
        console.log(idT);
        var user = snap.val();
        nom.innerHTML = user.nombre + nom.innerHTML; //Cambiar por nombre
        mail.innerHTML = ' '+idT+'@itam.mx' //Cambiar por correo
        carr.innerHTML =  user.carrera;
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

        var horarios = user.horarios;
        console.log(horarios);
        for(let h of horarios){
            var cell = document.getElementById(h);
            cell.style.backgroundColor = "#46AFDD";
            ref_horarios[h.slice(2)].push(h.slice(0,2));
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
    });
}

function changeMode(modeid) {
    console.log('change');
    var i;
    var class_name = modeid === 'info' ? "modeSch" : "modeInfo";
    var x = document.getElementsByClassName(class_name);
    console.log(x)
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    console.log(document.getElementById(modeid));
    document.getElementById(modeid).setAttribute('style', 'display:block;')
}



var sendMailTo;
btnMsj.addEventListener('click', e => {
    console.log("Send mail to: " + p.get("tutor"));
    sendMailTo = p.get("tutor");
    document.getElementById('message').style.display='block';
});

function enviarMail(){
    subject = document.getElementById("mailSub").value;
    message = document.getElementById("mailText").value;

    db.ref("usernames").orderByChild("username").equalTo(sendMailTo).on("child_added", function(u){
      if(u.val().esTutor == 1){
        db.ref("tutores/" + sendMailTo+ "/mensajes/" +  uid).set({
          titulo: subject,
          mensaje: message,
          leido: 0
        }).then(e=> window.alert('El mensaje fue enviado')).catch(err => {
          window.alert("Ha ocurrido un error. Intentalo de nuevo");
        });
      }
      else{
        db.ref("alumnos/" + sendMailTo+ "/mensajes/" +  uid).set({
          titulo: subject,
          mensaje: message,
          leido: 0
        }).then(e=> window.alert('El mensaje fue enviado')).catch(err => {
          window.alert("Ha ocurrido un error. Intentalo de nuevo");
        });
      }
    });

    document.getElementById('message').style.display='none';

  }


btnCita.addEventListener('click', e=>{
    console.log('click');
    //changeMode("scheduleApp");

    document.getElementsByClassName('modeSch')[0].setAttribute('style', 'display:block;')
    var x = document.getElementsByClassName('modeInfo');
    console.log(x)
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

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
    if(ddl_fechas.value != 'select'){
        console.log(ddl_fechas.value);
        var dia = {1: 'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 6:'Sat', 0:'Sun'};
        var dict_horarios = { 8:'8:00 - 9:00', 9:'9:00 - 10:00', 10:'10:00 - 11:00',
                            11: '11:00 - 12:00', 12:'12:00 - 13:00', 13:'13:00 - 14:00',
                            14: '14:00 - 15:00', 15:'15:00 - 16:00', 16:'16:00 - 17:00',
                            17: '17:00 - 18:00', 18:'18:00 - 19:00', 19:'19:00 - 20:00',
                            20: '20:00 - 21:00', 21:'21:00 - 22:00'};

        var selectedDate = new Date(ddl_fechas.value);
        var fechaId = dia[selectedDate.getDay()];
        console.log(fechaId);
        remove_options();

        var horarios = ref_horarios[fechaId];
        console.log(horarios.length);

        if(horarios.length === 0){
            console.log('cero');
            var elem = document.createElement('option');
            elem.value = 'noResults';
            elem.text = 'No hay horarios'
            ddl_horarios.appendChild(elem);
        }else{
            console.log('no cero');
            for(let h of horarios){
                var elem = document.createElement('option');
                var key = h[0]=='0' ? h[1] : h;
                elem.value = dict_horarios[key];
                elem.text = dict_horarios[key];
                ddl_horarios.appendChild(elem);
            }
        }
    }else{
        remove_options();
    }
});


btnAgendar.addEventListener('click', e => {
    db.ref('sesiones/').once('value', function(snap){
        var id = snap.numChildren();
        upload_sesion(id+1);
    });
});

function toggleWrite(){
    var m = writeZ.style.display;
    writeZ.style.display = m == "none" ? "block" : "none";
}

function sendRev(){
    if(writeZone.value.trim() == ""){return;}
    var options = {weekday: 'short', day:'2-digit', month:'long'};
    //uidAlumno:"321321"; 
    uidAlumno = firebase.auth().currentUser.uid;
    db.ref('tutores/'+p.get("tutor")+"/resenas/"+uidAlumno+"/").update({
        fecha: new Date().toLocaleDateString('en-US', options),
        text: writeZone.value.trim()
    }).then( e => window.alert('Tu reseña fue registrada')).catch(err => {
        window.alert('Ha ocurrido un error. Inténtalo de nuevo.');
        console.log(fecha);
    });
    toggleWrite();
}

function upload_sesion(sesId){
    console.log(sesId);
    if(ddl.value === 'select' || ddl_fechas.value === 'select' || ddl_horarios.value === 'select'){
        window.alert("Debes llenar todos los campos.");
        return;
    }

    if(ddl_horarios.value == 'noResults'){
        window.alert('Selecciona un horario válido');
        return;
    }
    var fecha = new Date(ddl_fechas.value);
    var options = {weekday: 'short', day:'2-digit', month:'long'};
    db.ref('sesiones/'+sesId).set({
        idTutor: p.get('tutor'),
        uidAlumno: firebase.auth().currentUser.uid,
        materia: ddl.value,
        fecha: fecha.toLocaleDateString('en-US', options),
        horario: document.getElementById('dd_horario').value,
        aceptada: 0
    }).then( e => window.alert('Tu sesión ya fue agendada')).catch(err => {
        window.alert('Ha ocurrido un error. Inténtalo de nuevo.');
        console.log(fecha);
    });
}

function remove_options(){
    for(var i = ddl_horarios.options.length -1 ; i >= 1; i--){
        ddl_horarios.remove(i);
    }
}


function loadRevs(idT){
    console.log("Seseñas"+idT);
    db.ref("tutores/"+idT+"/resenas").once("value", function(snapshot) {
        arr = snapshot.val();

        for(i in arr){
            var revName;
            var h5name = document.createElement("h5");
            db.ref("usernames/").once("value", function(snapshot) {
                h5name.innerText = snapshot.val()[i]["username"];
                console.log(revName)
            })
            console.log(revName)
    
            var dout = document.createElement("div");
            dout.className = "w3-panel w3-leftbar";
            var din = document.createElement("div");
            din.className = "w3-row-padding w3-cell-row";
            var dinn = document.createElement("div");
            dinn.className = "w3-rest";
            
            
            var pRev = document.createElement("p");
            pRev.innerText = arr[i]["text"]
            din.appendChild(h5name);
    
            dinn.appendChild(h5name);
            din.appendChild(dinn);
            din.appendChild(pRev);
            dout.appendChild(din);
    
            document.getElementById("all_revs").appendChild(dout);
        }
    });
}

//color ={"c1":"#F00", "c2":"#0f0", "bw1":"#0f0", "bw2":"#ff0"};
if(color){
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.color1 {background-color: #1 !important;}\
                      .color2 {background-color: #2 !important;}\
                      .bwcolor1 {color: #3 !important;}\
                      .bwcolor2 {color: #4 !important;}'
                      .replace("#1", color['c1'])
                      .replace("#2", color["c2"])
                      .replace("#3", color["bw1"])
                      .replace("#4", color["bw2"]);
      
  document.getElementsByTagName('head')[0].appendChild(style);
  if(color['bw1'][4]!='0'){
      var impath = document.getElementById('tutorMe').src;
      document.getElementById('tutorMe').src = impath.replace(".png", "W.png");
  }
}