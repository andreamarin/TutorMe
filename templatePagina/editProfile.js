var db, tutor,id, uid;
var btnConfirm;
var user, pswd, pswd2, carrera, precio;
var changes, changeUsr, changePswd, changeCarrera, changeRate, changeMat, changeHrs;
var materias = [];
var horarios = [];
var data;

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