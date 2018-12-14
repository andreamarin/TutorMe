  // Initialize Firebase
var config = {
    apiKey: "AIzaSyBsRQLAHqwZ8GGn4ZOYwMuN-Rt412Evf5c",
    authDomain: "tutorme-9b2cb.firebaseapp.com",
    databaseURL: "https://tutorme-9b2cb.firebaseio.com",
    projectId: "tutorme-9b2cb",
    storageBucket: "tutorme-9b2cb.appspot.com",
    messagingSenderId: "616196369980"
};
firebase.initializeApp(config);

var db = firebase.database();
var tutor,id, uid;
var btnConfirm;
var user, pswd, pswd2, carrera, precio;
var changes, changeUsr, changePswd, changeCarrera, changeRate, changeMat, changeHrs;
var materias = [];
var horarios = [];
var data;

var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
    if (mySidebar.style.display === 'block') {
        mySidebar.style.display = 'none';
        overlayBg.style.display = "none";
    } else {
        mySidebar.style.display = 'block';
        overlayBg.style.display = "block";
    }
}

// Close the sidebar with the close button
function w3_close() {
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
}

var totMat = 1;

var hours=["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"];
var days=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

var tab = document.getElementById("schTable");
var row, col, t;

for(i=0; i<14; i++){
  row = document.createElement("tr");
  row.id = "at"+hours[i];
  row.className = "w3-white";
  col =  document.createElement("td");
  
  col.style.borderRight = "1px grey solid";
  t = document.createTextNode(hours[i]+":00 - "+hours[i+1]+":00");
  col.appendChild(t);
  row.appendChild(col);
  for(j=0; j<7; j++){
    col =  document.createElement("td");

    col.className = "w3-btn w3-white w3-border";
    
    col.id = hours[i]+days[j];
    col.setAttribute("active", "0");
    col.setAttribute("onclick", "schToggle(this.id)");

    row.appendChild(col);
  }
  tab.appendChild(row);
}

function toggle(modeid) {
    
    var x = document.getElementById(modeid);
    if(x.style.display == "none"){
        x.style.display = "block";
    }else{
        x.style.display = "none";
    }
}

var catalogoMaterias = [];

var matRef = db.ref("materias");
matRef.on("value", function(snapshot){
  catalogoMaterias = snapshot.val();
}, function(errorObject){
  console.log("Read fail: " + errorObject.code)
});

var totMat=0;

function addMat(){
    var mat = document.createElement("select");
    mat.style.padding = "3px";
    mat.style.width = "60%";
    mat.style.margin = "3px";
    mat.id = "materia"+ (totMat++);
    
    for(i = 0; i < catalogoMaterias.length; i++){
        var elem = document.createElement("option");
        elem.value = catalogoMaterias[i].id;
        elem.text = catalogoMaterias[i].nombre;
        mat.appendChild(elem);
    }
    
    document.getElementById("materias").appendChild(mat);

}

function removeMat(){
    if(totMat>1){
        document.getElementById("materia"+ (--totMat)).remove();
    }
}

function schToggle(id){
  var x = document.getElementById(id);
  var i = x.className.indexOf("w3-white");
  if(i == -1){
    x.className = x.className.replace("w3-light-blue", "w3-white");
    x.setAttribute("active", "0");
  }else{
    x.className = x.className.replace("w3-white", "w3-light-blue");
    x.setAttribute("active", "1");
  }
}

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
        console.log(username);
  
        if(estutor === 1){
            btnProfile.href = 'tutorProfile.html';
            table_name = 'tutores';
        }else{
            btnProfile.href = 'profile.html';
            table_name = 'alumnos';
        }

        console.log(btnProfile.href);

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
  

var color = {'c1':"#44ff66",
         'c2':"#2B98F0",
         'bw1':"#000000",
         'bw2':"#000000",
         'imgsrc':"img/logoTutorMe.png"}
var color_ori = {};

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
            color['c1'] = usr.color1;
            color['c2'] = usr.color2;
            color['bw1'] = usr.bw1;
            color['bw2'] = usr.bw2;
            color_ori['c1'] = usr.color1;
            color_ori['c2'] = usr.color2;
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
});

// Vue reactive elements
new Vue({
    el:"#top_bar",
    data:{
        clr1:color,
    }
});

new Vue({
    el:"#color1",
    data:{
        clr1:color,

    },
    methods:{
        func:function(){color["c1"]=event.target.value}
    }
});

new Vue({
    el:"#btn_profile",
    data:{
        clr2:color,
    }
});

new Vue({
    el:"#color2",
    data:{
        clr2:color,
    },
    methods:{
        func:function(){color["c2"]=event.target.value}
    }
});
new Vue({
    el:"#picker",
    data:{
        clr:color,
    },
    methods:{
        func:function(){
            this.clr["c1"]=rgb2hex($('#color1').css('backgroundColor'));
            this.clr["bw1"]=$('#color1').css('color');
            this.clr['imgsrc'] = this.clr["bw1"][4] == "0" ? "img/logoTutorMe.png" : "img/logoTutorMeW.png";

            this.clr["c2"]=rgb2hex($('#color2').css('backgroundColor'));
            this.clr["bw2"]=$('#color2').css('color');
        }
    }
});

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}


// Other stuff

function get_elements(){
    user = document.getElementById("usr_field").value;
    pswd = document.getElementById("pswd_field").value;
    pswd2 = document.getElementById("pswd2_field").value;
    carrera = document.getElementById("carrera_field").value;

    changeUsr = (user != "");
    changeCarrera = (carrera != "");
    changePswd = (pswd != "");



    if(tutor == 1){
        db.ref("tutores/"+id).once('value', function(snapshot){
            var hours = ["08","09","10","11","12","13","14","15","16","17","18","19","20", "21"];
            var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            
            var usr = snapshot.val();
            materias = usr.materias;
            horarios = usr.horarios;

            var mat_length = materias.length;

            precio = document.getElementById("rate").value;
            changePrecio = (precio != "");


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

            changeHrs = (horarios.length != 0);

            var mat_dd = document.getElementById("materia0");
            var i = 0;
            while(mat_dd != null){
                materias.push(mat_dd.options[mat_dd.selectedIndex].value);
                i++;
                mat_dd = document.getElementById("materia"+i);
            }


            changeMat = (materias.length != mat_length);

            update_db();

        });
    }else{
        update_db();
    }
}

function update_db(){
    changes = false;
    data = {};

    //new colors
    if(color_ori['c1']!=color['c1'] || color_ori['c2']!=color['c2']){
        data['color1'] = color['c1'];
        data['color2'] = color['c2'];
        data['bw1'] = color['bw1'];
        data['bw2'] = color['bw2'];
        changes = true;
    }

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
        if(changeHrs){console.log("Cambio de horarios"); data['horarios'] = horarios; changes = true;}
        if(changeMat){data['materias'] = materias; changes = true;}
    }

    if(changes){
        var table_name = tutor == 1 ? 'tutores':'alumnos';
        var usrRef = db.ref(table_name+'/'+id);
        var res = usrRef.update(data);

        res.then(e => {
            window.alert('Actualización exitosa.');
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
