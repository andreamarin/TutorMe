var tutores = document.getElementById("tutores");
var nomMat = document.getElementById("nomMat");

var db = firebase.database();

var url = new URL(window.location);
var p = new URLSearchParams(url.search.substring(1));

var mat = p.get('mat');

db.ref("/materias/").orderByChild("id").equalTo(mat).on("child_added", function(s){
  nomMat.innerHTML = s.val().nombre;
  return;
});

db.ref("/tutores/").on("child_added", function(t){
  for(let m of t.val().materias){
    if(m == mat){
      var a = document.createElement('a');
      var h = new URL(window.location);
      var url = new URL('../templatePagina/tutorProfile.html', h);
      var p = url.searchParams;
      p.append('tutor',t.val().username);
      a.href = url;
      a.className = "w3-bar-item w3-button w3-hover-light-blue";
      a.style = "padding-left:2%";
      a.innerHTML = t.val().nombre;
      tutores.appendChild(a);
    }
  }
  return;
});
