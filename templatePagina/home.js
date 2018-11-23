const btnLogout = document.getElementById("btn_logout");
var tProx = document.getElementById("prox");
var prox = document.getElementById("divProx");
var pend = document.getElementById("divPend");
var rec = document.getElementById("divReci");
var tutAl = document.getElementById("TA");
var tutAlP = document.getElementById("tutAlPen");

var db = firebase.database();

btnLogout.addEventListener('click', e=> {
    firebase.auth().signOut();
    window.location.href = "index.html"
});

var uid;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    uid = firebase.auth().currentUser.uid;
    uid = "qIjPVPpFG5bxWlggcf0sHCRfbZc2";
  db.ref("/usernames/").orderByKey().equalTo(uid).on("child_added", function(snap){
    var username = snap.val().username;
    var tutor = snap.val().esTutor;
    console.log(tutor);
    if(tutor != undefined){
      console.log("Es tutor")
      setTutor(username);
    }else {
      console.log("No es tutor")
      setAlumno(uid);
    }
  });
  }

});



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
              btn.innerHTML = '<button class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
              tr.appendChild(btn);
              tProx.appendChild(tr);
            }else{
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
