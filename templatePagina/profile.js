var btnLogout, db;
var  id, url, carrera, cu, name, ref;

// Sidebar elements
var menu_name = document.getElementById("menu_name");
var btnLogout = document.getElementById('btn_logout');
var btnProfile = document.getElementById('btn_profile');
var table_name;
var color = {};

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
        get_values(username);
        if(estutor === 1){
            btnProfile.href = 'tutorProfile.html';
            tutor = true;
            table_name = 'tutores';
        }else{
            btnProfile.href = 'profile.html';
            table_name = 'alumnos';
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
  

(function() {
    db = firebase.database();
    const params = new URLSearchParams(window.location.search);
    
    if(params.has('id')){
        id = params.get('id');
        get_values(id);
    }else{
        firebase.auth().onAuthStateChanged(function(user) {
            ref = db.ref('usernames/'+user.uid);
            ref.on("value", function(snapshot){
                id = snapshot.val().username;
                get_values(id);
            }, function(errorObject){
                console.log("The read failed: " + errorObject.code);
            });
        });
    }
    // Get elements
    btnLogout = document.getElementById("btn_logout");
}()); 

btnLogout.addEventListener('click', e=> {
    firebase.auth().signOut();
    window.location.href = "index.html"
});

function get_values(id){
    // Get a database reference
    ref = db.ref("alumnos/"+id).on("value", function(snapshot) {
        var usr = snapshot.val();
        var storage = firebase.storage();
        var pathReference = storage.ref('profile_pictures/');
        var manRef = pathReference.child(usr.pp_path);
    
        manRef.getDownloadURL().then(function(url){
            var img_holder = document.getElementById("profile_img");
            img_holder.src = url;
        });

        document.getElementById("name").textContent = usr.nombre;
        document.getElementById("carreras").textContent = "Carrera(s): "+usr.carrera;
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    document.getElementById("username").textContent = id;
    document.getElementById("email").textContent = "Correo: "+id+"@itam.mx";
}

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