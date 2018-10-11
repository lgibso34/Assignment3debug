var getUserStatus;

window.onload = function(){ 
    document.getElementById("submit").addEventListener("click", matching);    
    }

var matching = function(){
    var pass1 = document.getElementById("pass");
    var pass2 = document.getElementById("passConfirm");

    if(pass1.value != pass2.value){
        alert("Passwords don't match!");
    }
}