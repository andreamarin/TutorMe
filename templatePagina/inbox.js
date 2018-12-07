color = {};
        // color['c1'] = snap.val().color1;
        // color['c2'] = snap.val().color2;
        // color['bw1'] = snap.val().bw1;
        // color['bw2'] = snap.val().bw2;

// Get the Sidebar
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

function changeMode(modeid) {
    var i;
    var x = document.getElementsByClassName("mode");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(modeid).style.display = "block";
}

function toggleShow(id){
  var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}


/*
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
*/