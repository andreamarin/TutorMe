var tutores = document.getElementById("tutores");
var nomMat = document.getElementById("nomMat");

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

firebase.auth().onAuthStateChanged(function(user){
    db.ref('usernames/'+user.uid).once('value', function(snap){
        console.log(snap.val());
        var username = snap.val().username;
        var esTutor = snap.val().esTutor;
        table_name;
        console.log(username);
        if(esTutor == 1){
            btnProfile.href = 'tutorProfile.html';
            table_name = 'tutores';
        }else{
            btnProfile.href = 'profile.html';
            table_name = 'alumnos';
        }

        db.ref(table_name+'/'+username).on('value', function(snap){
            menu_name.innerHTML = snap.val().nombre.split(" ")[0];
            var img_path = snap.val().pp_path;
            console.log(img_path);
            if( img_path != 'none'){
                var storage = firebase.storage();
                var pathReference = storage.ref('profile_pictures/');
                var manRef = pathReference.child(img_path);
                manRef.getDownloadURL().then(function(url){
                    var menu_pp = document.getElementById("menu_pp");
                    menu_pp.src = url;
                });
            }
        });

    })
});

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
