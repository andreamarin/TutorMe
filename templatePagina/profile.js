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
            if( img_path != "none"){
                console.log("(?)");
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
        var img_path = usr.pp_path;

        if(img_path != "none"){
            var storage = firebase.storage();
            var pathReference = storage.ref('profile_pictures/');
            var manRef = pathReference.child(usr.pp_path);
        
            manRef.getDownloadURL().then(function(url){
                var img_holder = document.getElementById("profile_img");
                img_holder.src = url;
            });
        }
        document.getElementById("name").textContent = usr.nombre;
        document.getElementById("carreras").textContent = usr.carrera;
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    document.getElementById("email").textContent = ""+id+"@itam.mx";
}

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