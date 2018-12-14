var tutores = document.getElementById("tutores");
var nomMat = document.getElementById("nomMat");
var color = {};

var db = firebase.database();

// Sidebar elements
var menu_name = document.getElementById("menu_name");
var btnLogout = document.getElementById('btn_logout');
var btnProfile = document.getElementById('btn_profile');
var table_name;

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


var url = new URL(window.location);
var p = new URLSearchParams(url.search.substring(1));
var mat = p.get('mat');

db.ref("/materias/").orderByChild("id").equalTo(mat).on("child_added", function(s){
  nomMat.innerHTML = s.val().nombre;
  return;
});

db.ref("/tutores/").on("child_added", function(t){
  console.log(t.val().materias);
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

(function(){
  for(i of document.getElementsByClassName('color1')){
    i.style.backgroundColor=color['c1'];
  }
  for(i of document.getElementsByClassName('color2')){
    i.style.backgroundColor=color['c2'];
  }
  for(i of document.getElementsByClassName('bwcolor1')){
    i.style.color=color['bw1'];
  }
  for(i of document.getElementsByClassName('bwcolor2')){
    i.style.color=color['bw2'];
  }
  if(color['bw1'][4]!='0'){
    document.getElementById('tutorMe').src += "img/logoTutorMeW.png"
  }
}());