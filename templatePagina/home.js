const btnLogout = document.getElementById("btn_logout");
var tProx = document.getElementById("prox");
var prox = document.getElementById("divProx");
var pend = document.getElementById("divPend");
var rec = document.getElementById("divReci");

var db = firebase.database();

btnLogout.addEventListener('click', e=> {
    firebase.auth().signOut();
    window.location.href = "index.html"
});

var user = firebase.auth().currentUser;
var uid = user.uid;
var username;
var tutor;

db.ref("/usernames/" + uid).on("child_added", function(snap){
  username = snap.val().username;
  tutor = snap.val().esTutor;
  return;
});

if(!tutor){
  pend.className += "w3-hidden";
  db.ref("/citas/").orderByChild("alumno").equalTo(username).on("child_added", function(cita){
    if(cita.val().aceptada == 1){
      var tr = document.createElement("tr");
      db.ref("/tutores/" + cita.val().tutor).on("child_added", function(tut){
        var nom = document.createElement("td");
        nom.innerHTML = tut.nombre;
        tr.appendChild(nom);
        return;
      });
      db.ref("/materas/").orderByChild("id").equalTo(cita.val().materia).on("child_added", function(mat){
        var m = document.createElement("td");
        m.innerHTML = mat.nombre;
        tr.appendChild(m);
        return;
      });
      //Cambiar para que sea con DATE
      var hr = document.createElement("td");
      hr.innerHTML = cita.val().hora;
      var dia = document.createElement("td");
      dia.innerHTML = cita.val().dia;
      tr.appendChild(dia);
      tr.appendChild(hr);
      var btn = document.createElement("td");
      btn.innerHTML = '<button class="w3-btn w3-round-xxlarge"><i class="material-icons">mail</i></button>';
      tr.appendChild(btn);
      tProx.appendChild(tr);
    }else {

    }
  });

}
