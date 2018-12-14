var tProx = document.getElementById("prox");
var tProxTutor = document.getElementById("proxTutor");
var prox = document.getElementById("divProx");
var pend = document.getElementById("divPend");
var pendTutor = document.getElementById("divPendTutor");
var rec = document.getElementById("divReci");
var tutAl = document.getElementById("TA");
var tutAlP = document.getElementById("tutAlPen");
var db = firebase.database();

// Sidebar elements
var menu_name = document.getElementById("menu_name");
var btnLogout = document.getElementById('btn_logout');
var btnProfile = document.getElementById('btn_profile');
var table_name;
var color = {};
var tutor = false;



btnLogout.addEventListener('click', e=> {
    firebase.auth().signOut();
    window.location.href = "index.html"
});

var uid;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    uid = user.uid;
    
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
          setSesTutor(uid);
      }else{
          btnProfile.href = 'profile.html';
          table_name = 'alumnos';
          setAlumno(uid);
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
              manref.getdownloadurl().then(function(url){
                  var menu_pp = document.getelementbyid("menu_pp");
                  menu_pp.src = url;
              });
          }
      });

    });
  }
});

function setSesTutor(ui){
  db.ref("/sesiones/").orderByChild("uidAlumno").equalTo(ui).on("child_added", function(ci){
      if(ci != undefined){
        var tr = document.createElement("tr");
        db.ref("/tutores/").orderByChild("username").equalTo(ci.val().idTutor).on("child_added", function(tut){
          var nom = document.createElement("td");
          nom.innerHTML = tut.val().nombre;
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
              btn.innerHTML = '<button onclick= rechazar(' + ci.key +') class="w3-btn w3-round-xxlarge w3-red">Cancelar</button><button class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
              tr.appendChild(btn);
              tProxTutor.appendChild(tr);

              tProxTutor.style.display = "block";
            }else{
              var btnAR = document.createElement("td");
              btnAR.innerHTML = '<button style = "display:none" class="w3-btn w3-round-xxlarge w3-blue">Aceptar</button> <button onclick= rechazar(' + ci.key +') class="w3-btn w3-round-xxlarge w3-red">Cancelar</button>';
              tr.appendChild(btnAR);
              var btn = document.createElement("td");
              btn.innerHTML = '<button class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
              tr.appendChild(btn);
              pendTutor.appendChild(tr);
              pendTutor.style.display = "block";
            }
            return;
          });

          return;
        });
      return;
      }
    });

  }



function setTutor(usrnm){
  console.log(usrnm);
  tutAl.innerHTML = "Alumno";
  tutAlP.innerHTML = "Alumno";
  db.ref("/sesiones/").orderByChild("idTutor").equalTo(usrnm).on("child_added", function(c){
        var tr = document.createElement("tr");
        console.log(c.val().idTutor);
        db.ref("/usernames/").orderByKey().equalTo(c.val().uidAlumno).on("child_added", function(sn){
          var alumno = sn.val().username;
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
                btn.innerHTML = '<button class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
                tr.appendChild(btn);
                tProx.appendChild(tr);
              }else{
                var btnAR = document.createElement("td");
                btnAR.innerHTML = '<button onclick= aceptar(' + c.key +') class="w3-btn w3-round-xxlarge w3-blue">Aceptar</button> <button onclick= rechazar(' + c.key +') class="w3-btn w3-round-xxlarge w3-red">Rechazar</button>';
                tr.appendChild(btnAR);
                var btn = document.createElement("td");
                btn.innerHTML = '<button class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
                tr.appendChild(btn);
                pend.appendChild(tr);
              }
              return;
            });

            return;
          });
          return;
        });
      return;
    });
}

function setAlumno(ui){
  tutAl.innerHTML = "Tutor";
  tutAlP.innerHTML = "Tutor";
  db.ref("/sesiones/").orderByChild("uidAlumno").equalTo(ui).on("child_added", function(ci){
        var tr = document.createElement("tr");
        db.ref("/tutores/").orderByChild("username").equalTo(ci.val().idTutor).on("child_added", function(tut){
          var nom = document.createElement("td");
          nom.innerHTML = tut.val().nombre;
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
              btn.innerHTML = '<button onclick= rechazar(' + ci.key +') class="w3-btn w3-round-xxlarge w3-red">Cancelar</button><button class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
              tr.appendChild(btn);
              tProx.appendChild(tr);
            }else{
              var btn = document.createElement("td");
              btn.innerHTML = '<button onclick= rechazar(' + ci.key +') class="w3-btn w3-round-xxlarge w3-red">Cancelar</button><button class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
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

  function rechazar(key){
    console.log("remove");
    var ref = db.ref("/sesiones/" + key);
    var res = ref.remove();
    res.then(e => {
        console.log('Update exitoso');
    })
    .catch(err => {
        console.log("error "+err.message);
    });
  }


// (function(){
//   for(i of document.getElementsByClassName('color1')){
//     i.style.backgroundColor=color['c1'];
//   }
//   for(i of document.getElementsByClassName('color2')){
//     i.style.backgroundColor=color['c2'];
//   }
//   for(i of document.getElementsByClassName('bwcolor1')){
//     i.style.color=color['bw1'];
//   }
//   for(i of document.getElementsByClassName('bwcolor2')){
//     i.style.color=color['bw2'];
//   }
//   //if(color['bw1'][4]!='0'){
//   //  document.getElementById('tutorMe').src += "img/logoTutorMeW.png"
//   //}
// }());
