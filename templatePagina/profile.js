var btnLogout, db;
var  id, url, carrera, cu, name, ref;

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