var tProx = document.getElementById("prox");
var tProxTutor = document.getElementById("proxTutor");
var prox = document.getElementById("prox");
var pend = document.getElementById("divPend");
var pendTutor = document.getElementById("divPendTutor");
var rec = document.getElementById("tabReci");
var tutAl = document.getElementById("TA");
var tutAlP = document.getElementById("tutAlPen");
var btnmail = document.getElementById("btnmail");
var db = firebase.database();

// Sidebar elements
var menu_name = document.getElementById("menu_name");
var btnLogout = document.getElementById('btn_logout');
var btnProfile = document.getElementById('btn_profile');
var table_name;
var color = {};
var tutor = false;

var sendMailTo;

btnLogout.addEventListener('click', e=> {
    firebase.auth().signOut();
    window.location.href = "index.html"
});

var uid;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    uid = user.uid;
    //Coso para rellenar tabla de tutores recientes
    /*
    db.ref("sesiones/").orderByChild("uidAlumno").equalTo(uid).once("value", function(u){
      console.log("holis");
      console.log(u.val());
      u.val().forEach(session => {
        if(new Date(session.fecha + ", 2018") <  new Date() ){
          var row = document.createElement("tr");
          
          var elem = document.createElement("td");
          db.ref("tutores/" + session.idTutor).on("value", function(snap){
            elem.innerHTML = snap.val().nombre;
            row.appendChild(elem);
            elem = document.createElement("td");
            elem.innerHTML = snap.val().carrera;
            row.appendChild(elem);
            
            var btn = document.createElement("button");
            elem = document.createElement("td");
            btn.className = "w3-btn w3-round-xxlarge w3-blue color2 bwcolor2";
            btn.innerHTML = "Nueva Sesion";
            elem.appendChild(btn);
            row.appendChild(elem);
            
            elem = document.createElement("td");
            btn = document.createElement("button");
            btn.className = "w3-btn w3-round-xxlarge w3-blue color2 bwcolor2";
            btn.innerHTML = "Reseña";
            elem.appendChild(btn);
            row.appendChild(elem);
            
            elem = document.createElement("td");
            btn = document.createElement("button");
            btn.setAttribute("onclick", 'showMail(tutor)');
            btn.className = "w3-btn w3-round-xxlarge";
            btn.innerHTML = '<i class="material-icons">mail</i>';
            elem.appendChild(btn);
            row.appendChild(elem);
          });
          rec.appendChild(row);
        }else{
          
        }
        
      });
      
    });*/

    db.ref('usernames/'+uid).once('value', function(snap){
      console.log(snap.val());
      var username = snap.val().username;
      var estutor = snap.val().esTutor;
      console.log(username);

      if(estutor === 1){
          btnProfile.href = 'tutorProfile.html';
          tutor = true;
          table_name = 'tutores';
          setTutor(username);
      }else{
          btnProfile.href = 'profile.html';
          table_name = 'alumnos';
          setAlumno(uid);
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

    });
  }
});

var alumno;
function setTutor(usrnm){
  var startDate = new Date();
  
  console.log(usrnm);
  tutAl.innerHTML = "Alumno";
  tutAlP.innerHTML = "Alumno";
  db.ref("/sesiones/").orderByChild("idTutor").equalTo(usrnm).on("child_added", function(c){
        var tr = document.createElement("tr");
        console.log(c.val().idTutor);
        if(new Date(c.val().fecha + ", 2018") >  new Date() ){
        db.ref("/usernames/").orderByKey().equalTo(c.val().uidAlumno).on("child_added", function(sn){
          alumno = sn.val().username;
          db.ref("/alumnos/").orderByChild("username").equalTo(alumno).on("child_added", function(al){
            var nom = document.createElement("td");
            nom.innerHTML = al.val().nombre;
            console.log(al.val().nombre);
            tr.appendChild(nom);
            db.ref("/materias/").orderByChild("id").equalTo(c.val().materia).on("child_added", function(mat){
              var m = document.createElement("td");
              m.innerHTML = mat.val().nombre;
              tr.appendChild(m);
              var hr = document.createElement("td");
              hr.innerHTML = c.val().horario;
              var dia = document.createElement("td");
              dia.innerHTML = c.val().fecha;
              tr.appendChild(dia);
              tr.appendChild(hr);
              if(c.val().aceptada == 1){
                var btn = document.createElement("td");
                btn.innerHTML = '<button onclick=showMail(alumno) class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
                tr.appendChild(btn);
                tProx.appendChild(tr);
              }else{
                var btnAR = document.createElement("td");
                btnAR.innerHTML = '<button onclick= aceptar(' + c.key +') class="w3-btn w3-round-xxlarge btnColor">Aceptar</button> <button onclick= rechazar(' + c.key +') class="w3-btn w3-round-xxlarge btnColor2">Rechazar</button>';
                tr.appendChild(btnAR);
                var btn = document.createElement("td");
                btn.innerHTML = '<button onclick=showMail(alumno) class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
                tr.appendChild(btn);
                pend.appendChild(tr);
              }
              return;
            });

            return;
          });
          return;
        });
      }
      return;
    });
}

var usrTut;
function setAlumno(ui){
  tutAl.innerHTML = "Tutor";
  tutAlP.innerHTML = "Tutor";
  db.ref("/sesiones/").orderByChild("uidAlumno").equalTo(ui).on("child_added", function(ci){
      var tr = document.createElement("tr");
      if(new Date(ci.val().fecha + ", 2018") >  new Date() ){
        db.ref("/tutores/").orderByChild("username").equalTo(ci.val().idTutor).on("child_added", function(tut){
          var nom = document.createElement("td");
          nom.innerHTML = tut.val().nombre;
          usrTut = tut.val().username;
          console.log(tut.val().nombre);
          tr.appendChild(nom);
          db.ref("/materias/").orderByChild("id").equalTo(ci.val().materia).on("child_added", function(mate){
            var m = document.createElement("td");
            console.log(mate.val());
            m.innerHTML = mate.val().nombre;
            tr.appendChild(m);
            var hr = document.createElement("td");
            hr.innerHTML = ci.val().horario;
            var dia = document.createElement("td");
            dia.innerHTML = ci.val().fecha;
            console.log(ci.val().fecha);
            tr.appendChild(dia);
            tr.appendChild(hr);
            if(ci.val().aceptada == 1){
              var btn = document.createElement("td");
              btn.innerHTML = '<button onclick= rechazar(' + ci.key +') class="w3-btn w3-round-xxlarge btnColor2">Cancelar</button><button onclick= showMail(usrTut) class="w3-btn w3-round-xxlarge" ><i class="material-icons">mail</i></button>';
              tr.appendChild(btn);
              tProx.appendChild(tr);
            }else{
              var btn = document.createElement("td");
              btn.innerHTML = '<button onclick= rechazar(' + ci.key +') class="w3-btn w3-round-xxlarge btnColor2">Cancelar</button><button onclick=showMail(usrTut) class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
              tr.appendChild(btn);


              pend.appendChild(tr);
            }
            return;
          });

          return;
        });
      }else{
        db.ref("/tutores/").orderByChild("username").equalTo(ci.val().idTutor).on("child_added", function(tut){
          var nom = document.createElement("td");
          nom.innerHTML = tut.val().nombre;
          usrTut = tut.val().username;
          console.log(tut.val().nombre);
          tr.appendChild(nom);
          db.ref("/materias/").orderByChild("id").equalTo(ci.val().materia).on("child_added", function(mate){
            var m = document.createElement("td");
            console.log(mate.val());
            m.innerHTML = mate.val().nombre;
            tr.appendChild(m);
            var hr = document.createElement("td");
            hr.innerHTML = ci.val().horario;
            var dia = document.createElement("td");
            dia.innerHTML = ci.val().fecha;
            console.log(ci.val().fecha);
            tr.appendChild(dia);
            tr.appendChild(hr);
            if(ci.val().aceptada == 1){
              var btn = document.createElement("td");
              btn.innerHTML = '<button onclick= showMail(usrTut) class="w3-btn w3-round-xxlarge" ><i class="material-icons">mail</i></button>';
              tr.appendChild(btn);
              rec.appendChild(tr);
            }
            return;
          });

          return;
        });
      }
      
      return;
    });

  }



function aceptar(key){
    var ac = {};
    ac['aceptada'] = 1;
    var ref = db.ref("/sesiones/" + key);
    var res = ref.update(ac);
    res.then(e => {
        console.log('Update exitoso');
        location.reload();
    })
    .catch(err => {
        console.log("error "+err.message);
    });

  }

  function showMail(sendTo){
    console.log("Send mail to: " + sendTo);
    sendMailTo = sendTo;
    document.getElementById('message').style.display='block';
  }

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

  function rechazar(key){
    console.log("remove");
      if(confirm("¿Estás seguro que quieres cancelar la sesión?")){
      var ref = db.ref("/sesiones/" + key);
      var res = ref.remove();
      res.then(e => {
          console.log('Update exitoso');
      })
      .catch(err => {
          console.log("error "+err.message);
      });
    }
  }


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


/*
var tutor;
function setSesTutor(ui){
  db.ref("/sesiones/").orderByChild("uidAlumno").equalTo(ui).on("child_added", function(ci){
      if(ci != undefined){
        var tr = document.createElement("tr");
        db.ref("/tutores/").orderByChild("username").equalTo(ci.val().idTutor).on("child_added", function(tut){
          var nom = document.createElement("td");
          nom.innerHTML = tut.val().nombre;
          console.log(tut.val().nombre);
          tutor = tut.val().username;
          tr.appendChild(nom);
          db.ref("/materias/").orderByChild("id").equalTo(ci.val().materia).on("child_added", function(mate){
            var m = document.createElement("td");
            console.log(mate.val());
            m.innerHTML = mate.val().nombre;
            tr.appendChild(m);
            var hr = document.createElement("td");
            hr.innerHTML = ci.val().horario;
            var dia = document.createElement("td");
            dia.innerHTML = ci.val().fecha;
            console.log(ci.val().fecha);
            tr.appendChild(dia);
            tr.appendChild(hr);

            if(ci.val().aceptada == 1){
              var btn = document.createElement("td");
              btn.innerHTML = '<button onclick= rechazar(' + ci.key +') class="w3-btn w3-round-xxlarge btnColor2">Cancelar</button><button onclick=showMail(tutor) class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
              tr.appendChild(btn);
              tProxTutor.appendChild(tr);

              tProxTutor.style.display = "block";
            }else{
              var btnAR = document.createElement("td");
              btnAR.innerHTML = '<button style = "display:none" class="w3-btn w3-round-xxlarge btnColor">Aceptar</button> <button onclick= rechazar(' + ci.key +') class="w3-btn w3-round-xxlarge btnColor2">Cancelar</button>';
              tr.appendChild(btnAR);
              var btn = document.createElement("td");
              btn.innerHTML = '<button onclick=showMail(tutor) class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
              tr.appendChild(btn);
              pendTutor.appendChild(tr);
              pendTutor.style.display = "";
            }
            return;
          });

          return;
        });
      return;
      }
    });

  }
  */


