var btnLogout, db;
var  id, url, carrera, cu, name, ref;

(function() {
    db = firebase.database();
    const params = new URLSearchParams(window.location.search);
    
    if(params.has('id')){
        id = params.get('id');
    }else{
        firebase.auth().onAuthStateChanged(function(user) {
            ref = db.ref('usernames/'+user.uid);
            ref.on("value", function(snapshot){
                id = snapshot.val().username;
            }, function(errorObject){
                console.log("The read failed: " + errorObject.code);
            });

            get_values();
        });
    }
    // Get elements
    btnLogout = document.getElementById("btn_logout");
}()); 

btnLogout.addEventListener('click', e=> {
    firebase.auth().signOut();
    window.location.href = "index.html"
});

function get_values(){
    // Get a database reference
    ref = db.ref("alumnos/"+id);
    // Attach an asynchronous callback to read the data
    ref.on("value", function(snapshot) {
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