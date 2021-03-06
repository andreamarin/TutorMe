color = {};
        // color['c1'] = snap.val().color1;
        // color['c2'] = snap.val().color2;
        // color['bw1'] = snap.val().bw1;
        // color['bw2'] = snap.val().bw2;

// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");
var tablaMensajes = document.getElementById("tablaMensajes");

var sendReply = document.getElementById("enviar");
// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");
var nombreMensaje  = document.getElementById("nombreMensaje");
var tituloMensaje = document.getElementById("tituloMensaje");
var textoMensaje = document.getElementById("textoMensaje");
var btnLogout = document.getElementById('btn_logout');
var btnEnviar = document.getElementById('enviar_mensaje');
// Toggle between showing and hiding the sidebar, and add overlay effect

btnLogout.addEventListener('click', e=> {
    firebase.auth().signOut();
    window.location.href = "index.html"
});

function w3_open() {
    if (mySidebar.style.display === 'block') {
        mySidebar.style.display = 'none';
        overlayBg.style.display = "none";
    } else {
        mySidebar.style.display = 'block';
        overlayBg.style.display = "block";
    }
}

// Close the sidebar with the close button
function w3_close() {
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
}

function changeMode(modeid) {
    var i;
    var x = document.getElementsByClassName("mode");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(modeid).style.display = "block";
}

function toggleShow(id){
  var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

var db = firebase.database();
// Sidebar elements
var menu_name = document.getElementById("menu_name");
var btnLogout = document.getElementById('btn_logout');
var btnProfile = document.getElementById('btn_profile');
var table_name;
var username;
var color = {};
var uid;


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uid = user.uid;

      db.ref('usernames/'+uid).once('value', function(snap){
        console.log(snap.val());
        username = snap.val().username;
        var estutor = snap.val().esTutor;
        console.log(username);

        if(estutor === 1){
            btnProfile.href = 'tutorProfile.html';
            tutor = true;
            table_name = 'tutores';
        }else{
            btnProfile.href = 'profile.html';
            table_name = 'alumnos';
        }
        console.log(table_name);
        db.ref(table_name+'/'+username).on('value', function(snap){
            color['c1'] = snap.val().color1;
            color['c2'] = snap.val().color2;
            color['bw1'] = snap.val().bw1;
            color['bw2'] = snap.val().bw2;
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
          showMessages();
      });

    }
  });

var replyTo;
function showMessages(){
  db.ref(table_name + "/" + username + "/mensajes").limitToLast(15).on("child_added", function(snap){
    var div = document.createElement("div");
    div.className = "w3-row w3-bar-item w3-button color2 bwcolor2";
    div.value = snap.key;
    console.log("Value: " + div.value);
    var d = document.createElement("div");
    d.className = "w3-col";
    d.style = "width: 50px"
    var i = document.createElement("i");
    i.className = "material-icons";
    i.innerHTML = "email";
    d.appendChild(i);
    div.appendChild(d);
    db.ref("usernames").orderByKey().equalTo(snap.key).on("child_added", function(f){
        if(f.val().esTutor ==  1){
          db.ref("tutores").orderByChild("username").equalTo(f.val().username).on("child_added", function(t){
            var name = document.createElement("div");
            name.className = "w3-col";
            name.style = "width: 13%";
            name.innerHTML = "<b>" + t.val().nombre + "</b>";
            div.appendChild(name);

            var text = document.createElement("div");
            text.className = "w3-rest";
            text.innerHTML = snap.val().titulo + " - " + snap.val().mensaje.substring(0, 90) + "...";
            div.appendChild(text);
            tablaMensajes.appendChild(div);

            div.addEventListener('click', function(){
              i.innerHTML = "drafts";
              changeMode('message');
              tituloMensaje.innerHTML = snap.val().titulo;
              nombreMensaje.innerHTML = t.val().nombre;
              textoMensaje.innerHTML = snap.val().mensaje;
                sendReply.value = div.value;
            });

          });
        }else{
          usr = f.val().username;
          console.log(usr);
          db.ref("alumnos").orderByChild("username").equalTo(usr).on("child_added", function(t){
            var name = document.createElement("div");
            name.className = "w3-col";
            name.style = "width: 13%";
            name.innerHTML = "<b>" + t.val().nombre + "</b>";
            console.log(t.val().nombre);
            div.appendChild(name);

            var text = document.createElement("div");
            text.className = "w3-rest";
            text.innerHTML = snap.val().titulo + " - " + snap.val().mensaje.substring(0, 90) + "...";
            div.appendChild(text);
            tablaMensajes.appendChild(div);

            div.addEventListener('click', function(){
              i.innerHTML = "drafts";
              changeMode('message');
              tituloMensaje.innerHTML = snap.val().titulo;
              nombreMensaje.innerHTML = t.val().nombre;
              textoMensaje.innerHTML = snap.val().mensaje;

              sendReply.value = div.value;


            });
          });
        }
    });

  });
}


sendReply.addEventListener('click', function(){
  //console.log("holi");
   var replyTo = sendReply.value;
   console.log(replyTo);
    subject = document.getElementById("replyT").value;
    message = document.getElementById("replyM").value;
   sendMessage(replyTo, subject, message, false);
  
});

btnEnviar.addEventListener('click', e =>{
  var sendTo = document.getElementById("dest").value.split("@")[0];
  var subject = document.getElementById("subject").value;
  var mssg = document.getElementById("mssg").value;
  db.ref("usernames").orderByChild("username").equalTo(sendTo).on("value", function(s){
    if(s.val() != null){
      db.ref("usernames").orderByChild("username").equalTo(sendTo).on("child_added", function(u){
        sendMessage(u.key, subject, mssg, true);
      });
    }else{
      window.alert("No existe ese usuario.")
    }
  });
});

function sendMessage(user, subject, message, rep){
  console.log(user);
  db.ref("usernames").orderByKey().equalTo(user).on("child_added", function(u){
    if(u.val().esTutor == 1){
      db.ref("tutores/" + u.val().username + "/mensajes/" +  uid).set({
        titulo: subject,
        mensaje: message,
        leido: 0
      }).then(e=>{
        if(rep){ changeMode('inbox');}else{
          toggleShow('reply');
        }
        window.alert('El mensaje fue enviado');
      }).catch(err => {
        window.alert("Ha ocurrido un error. Intentalo de nuevo");
      });
    }
    else{
      db.ref("alumnos/" + u.val().username+ "/mensajes/" +  uid).set({
        titulo: subject,
        mensaje: message,
        leido: 0
      }).then(e=> {
        if(rep){ changeMode('inbox');}else{
          toggleShow('reply');
        }
        window.alert('El mensaje fue enviado');
      }).catch(err => {
        window.alert("Ha ocurrido un error. Intentalo de nuevo");
      });
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

