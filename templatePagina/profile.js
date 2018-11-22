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
        });
    }
    window.setTimeout(get_values, 700);

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
        name = usr.nombre;
        document.getElementById("carreras").textContent = "Carrera(s): "+usr.carrera;
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    document.getElementById("name").textContent = name;
    document.getElementById("username").textContent = id;
    document.getElementById("email").textContent = "Correo: "+id+"@itam.mx";
}