
const busquedaT = document.getElementById("busquedaTut");

busquedaT.addEventListener('keypress', function(e){
  if(e.key == "Enter" && busquedaT.value != ''){
    while(divT.hasChildNodes()){
      divT.removeChild(divT.lastChild);
    }
    var query = db.ref("/tutores/");
    query.orderByChild("username").equalTo(busquedaT.value).on('child_added', function(snap){
    var a = document.createElement('a');
    var h = new URL(window.location);
    var url = new URL('../templatePagina/tutorProfile.html', h);
    var p = url.searchParams;
    p.append('tutor',snap.val().username);
    a.href = url;
    a.className = "w3-bar-item w3-button w3-hover-light-blue";
    a.style = "padding-left:2%";
    a.innerHTML = snap.val().username ;
    divT.appendChild(a);
    return;
  });
}else{
  if(busquedaT.value == ''){
    while(divT.hasChildNodes()){
      divT.removeChild(divT.lastChild);
    }
    loadTutors();
  }
}
return;
});

const bus = document.getElementById("busqueda");

busqueda.addEventListener('keypress', function(e){
  if(e.key == "Enter" && bus.value != ''){
    while(bySub.hasChildNodes()){
      bySub.removeChild(bySub.lastChild);
    }
    var query = db.ref("/materias/");
    query.orderByChild("nombre").equalTo(busqueda.value).on('child_added', function(snap){
      var a = document.createElement("a");
      a.href = "searchMateria.html";
      a.className = "w3-bar-item w3-button w3-hover-light-blue";
      a.style = "padding-left:2%";
      a.innerHTML = snap.val().nombre;
      bySub.appendChild(a);
      return;
    });
  }
  else {
    if(bus.value == ''){
      while(bySub.hasChildNodes()){
        bySub.removeChild(bySub.lastChild);
      }
      loadMaterias();
    }
  }
 return;

});


function loadTutors(){
  var query = db.ref("/tutores/");
  query.orderByChild("username").on('child_added', function(snap){
  var a = document.createElement('a');
  var h = new URL(window.location);
  var url = new URL('../templatePagina/tutorProfile.html', h);
  var p = url.searchParams;
  p.append('tutor',snap.val().username);
  a.href = url;
  a.className = "w3-bar-item w3-button w3-hover-light-blue";
  a.style = "padding-left:2%";
  a.innerHTML = snap.val().username ;
  divT.appendChild(a);
  return;
});
}

function loadMaterias(){
  var query = db.ref("/deptos/");
  query.orderByChild("nombre").on('child_added', function(snap){
    var btn = document.createElement("button");
    btn.className =   "w3-button w3-block w3-left-align w3-green";
    btn.id = snap.val().nombre;
    var id = snap.val().id;
    btn.innerHTML = snap.val().nombre;
    bySub.appendChild(btn);
    addMat(id);
    btn.onclick = function(){
      var x = document.getElementById(id);
      if (x.className.indexOf("w3-show") == -1) {
          x.className += " w3-show";
      } else {
          x.className = x.className.replace(" w3-show", "");
      }
    };

    return;
  });

}

function addMat(nomDep){
  var divD = document.createElement("div");
  divD.id = nomDep;
  divD.className = "w3-bar-block w3-hide";
  var query = db.ref("/materias/");
  bySub.appendChild(divD);
  query.orderByChild("depId").equalTo(nomDep).on('child_added', function(snap){
      var a = document.createElement("a");
      a.href = "searchMateria.html";
      a.className = "w3-bar-item w3-button w3-hover-light-blue";
      a.style = "padding-left:2%";
      a.innerHTML = snap.val().nombre;
      divD.appendChild(a);
      return;
  });
}



var db = firebase.database();
const divT = document.getElementById("tutores");
const bySub = document.getElementById("materias");
loadTutors();
loadMaterias();
