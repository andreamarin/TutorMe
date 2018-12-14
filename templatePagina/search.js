// Sidebar elements
var menu_name = document.getElementById("menu_name");
var btnLogout = document.getElementById('btn_logout');
var btnProfile = document.getElementById('btn_profile');
var table_name;
var color = {};
var db = firebase.database();

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
      console.log(username);

      if(estutor === 1){
          btnProfile.href = 'tutorProfile.html';
          tutor = true;
          table_name = 'tutores';
      }else{
          btnProfile.href = 'profile.html';
          table_name = 'alumnos';
      }
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
    a.innerHTML = snap.val().nombre ;
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
<<<<<<< HEAD
      a.className = "w3-bar-item w3-button w3-hover-light-blue";
=======
      a.className = "w3-bar-item w3-button header color2 bwcolor2";
>>>>>>> 3da3f9aada27b6aad880dee243cd28867112bd0d
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
  a.className = "w3-bar-item w3-button tableHeader";
  a.style = "padding-left:2%";
  a.innerHTML = snap.val().nombre ;
  divT.appendChild(a);
  return;
});
}

function loadMaterias(){
  var query = db.ref("/deptos/");
  query.orderByChild("nombre").on('child_added', function(snap){
    var btn = document.createElement("button");
<<<<<<< HEAD
    btn.className =   "w3-button w3-block w3-left-align w3-green color2 bwcolor2";
=======
    btn.className =   "w3-button w3-block w3-left-align tableHeader";
>>>>>>> 3da3f9aada27b6aad880dee243cd28867112bd0d
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
      var here = new URL(window.location);
      var url = new URL("../templatePagina/searchMateria.html", here);
      var p = url.searchParams;
      p.append('mat', snap.val().id);
      a.href = url;
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