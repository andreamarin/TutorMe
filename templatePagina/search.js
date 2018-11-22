
const busquedaT = document.getElementById("busquedaTut");

busquedaT.addEventListener('keypress', function(e){
  if(e.key == "Enter"){
    while(divT.hasChildNodes()){
      divT.removeChild(divT.lastChild);
    }
    var query = db.ref("/tutores/");
    query.orderByChild("username").startAt(busquedaT.value).on('child_added', function(snap){
    var a = document.createElement('a');
    a.href = 'tutorProfile.html';
    a.className = "w3-bar-item w3-button w3-hover-light-blue";
    a.style = "padding-left:2%";
    a.innerHTML = snap.val().username ;
    divT.appendChild(a);
    return;
  });
}else{
  return;
}
});

function loadTutors(){
  var query = db.ref("/tutores/");
  query.orderByChild("username").on('child_added', function(snap){
  var a = document.createElement('a');
  a.href = 'tutorProfile.html';
  a.className = "w3-bar-item w3-button w3-hover-light-blue";
  a.style = "padding-left:2%";
  a.innerHTML = snap.val().username ;
  divT.appendChild(a);
  return;
});
}


var db = firebase.database();
const divT = document.getElementById("tutores");
loadTutors();
