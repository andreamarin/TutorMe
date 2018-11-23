var db, tutor,id, uid;
var btnConfirm;
var user, pswd, pswd2, carrera, precio;
var changes, changeUsr, changePswd, changeCarrera, changeRate, changeMat, changeHrs;
var materias = [];
var horarios = [];
var data;

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


(function(){
    db = firebase.database();
    firebase.auth().onAuthStateChanged(function(user) {
        uid = user.uid;
        ref = db.ref('usernames/'+uid);
        ref.on("value", function(snapshot){
            usr = snapshot.val();
            console.log(usr);
            id = usr.username;
            tutor = usr.esTutor;
            if(tutor == 1){
                document.getElementById("ifTutor").style.display = "block";
            }
        }, function(errorObject){
            console.log("The read failed: " + errorObject.code);
        });
    });
    btnConfirm = document.getElementById('btn_confirm');
}());

btnConfirm.addEventListener('click', e => {
    get_elements();
    update_db();
});

function get_elements(){
    user = document.getElementById("usr_field").value;
    pswd = document.getElementById("pswd_field").value;
    pswd2 = document.getElementById("pswd2_field").value;
    carrera = document.getElementById("carrera_field").value;

    changeUsr = (user != "");
    changeCarrera = (carrera != "");
    changePswd = (pswd != "");

    var hours = ["08","09","10","11","12","13","14","15","16","17","18","19","20", "21"];
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    if(tutor == 1){
        var refUsr = db.ref('tutores'/id);
        refUsr.on('value', function(snapshot){
            var usr = snapshot.val();
            materias = usr.materias;
            horarios = usr.horarios;
        });

        var mat_length = materias.length;

        precio = document.getElementById("rate").value;
        changePrecio = (precio != "");

        var mat_dd = document.getElementById("materia0");
        var i = 0;
        do{
            materias.push(mat_dd.options[mat_dd.selectedIndex].value);
            i++;
            mat_dd = document.getElementById("materia"+i);
        }while(mat_dd != null);

        changeMat = (materias.length != mat_length);

        var h;
        days.forEach(function(day) {
            hours.forEach(function(hrs){
                horario = hrs+day;
                h = document.getElementById(horario).getAttribute('active');
                if(h === "1"){
                    horarios.push(horario);
                }
            });
        });

        changeHrs = (horarios != []);
    }
}

function update_db(){
    changes = false;
    data = {};

    if(changeUsr){ 
        console.log(user);
        data['nombre'] = document.getElementById("usr_field").value;
        changes = true;
    }

    if(changeCarrera){data['carrera'] = carrera; changes = true;}

    if(changePswd){
        if(pswd.length < 6){
            window.alert('Tu contraseña debe contener mínimo 6 caracteres');
            return;
        }

        if(pswd != pswd2){
            window.alert('Las contraseñas no coinciden');
            return;
        }

        var user = firebase.auth().currentUser;
        user.updatePassword(pswd).then(function(){
            console.log('Cambio exitoso');
        }).catch(function(error){
            console.log('Hubo un error');
            return;
        });
    }

    if(tutor == 1){
        if(changeRate){data['rate'] = precio; changes = true;}
        if(changeHrs){data['horarios'] = horarios; changes = true;}
        if(changeMat){data['materias'] = materias; changes = true;}
    }

    if(changes){
        var table_name = tutor == 1 ? 'tutores':'alumnos';
        var usrRef = db.ref(table_name+'/'+id);
        var res = usrRef.update(data);

        res.then(e => {
            console.log('Update exitoso');
        })
        .catch(err => {
            console.log("error "+err.message);
        });

    }else{
        console.log('No cambios.')
        window.alert('No has ingresado ningún dato');
    }
}