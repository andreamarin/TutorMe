var nom = document.getElementById("nombre");
var mail = document.getElementById("mail");
var carr = document.getElementById("carrera");
var mat = document.getElementById("mat");
var costo = document.getElementById("costo");
var nomSch = document.getElementById("nomSch")
var cstoS = document.getElementById("cS");
var ddl = document.getElementById("materia");
var db = firebase.database();



var url = new URL(window.location);
var p = new URLSearchParams(url.search.substring(1));

var idT = p.get("tutor");

db.ref("/tutores/").orderByChild("username").equalTo(idT).on("child_added", function(snap){
  nom.innerHTML = snap.val().username + nom.innerHTML; //Cambiar por nombre
  mail.innerHTML = snap.val().clave_unica; //Cambiar por correo
  carr.innerHTML =  "Carrera: " + snap.val().carrera;
  costo.innerHTML = "$" +snap.val().rate;

  nomSch.innerHTML = snap.val().username; //Cambiar a nombre
  cstoS.innerHTML = "$" + snap.val().rate;

  for(let m of snap.val().materias){
    db.ref("/materias/").orderByChild("id").equalTo(m).on("child_added", function(n){
      var l = document.createElement("li");
      l.innerHTML = n.val().nombre;
      mat.appendChild(l);

      var o = document.createElement("option");
      o.value = n.val().id;
      o.innerHTML = n.val().nombre;
      ddl.appendChild(o);
      return;
    });

  }


  return;
});
