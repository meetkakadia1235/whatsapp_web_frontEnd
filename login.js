function checkLogin() {
    var username = document.getElementById("username");
    var password = document.getElementById("password");

    var htp = new XMLHttpRequest();

    htp.onreadystatechange = function () {
        if (htp.readyState == 4) {
            var response = JSON.parse(htp.responseText)
            if (response.status == true) {
                window.location.href = "home.html";
                sessionStorage.setItem("id",response.data[0].id);
            }
            else {
                console.log("not done");
                username.value="";
                password.value="";
            }
        }
    }

    htp.open("get", "http://localhost:8048/login/"+username.value+"/"+password.value, true);
    htp.send();
}