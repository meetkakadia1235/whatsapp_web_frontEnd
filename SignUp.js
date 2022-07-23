var clearUsername = false;
var clearPhoneNumber = false;

function SignUp() {
  var firstName = document.getElementById("firstName");
  var lastName = document.getElementById("lastName");
  var userName = document.getElementById("userName");
  var password = document.getElementById("password");
  var phoneNumber = document.getElementById("phoneNumber");
  checkPhoneNumber();
  var jsonData = {
    firstName: firstName.value,
    lastName: lastName.value,
    username: userName.value,
    password: password.value,
    phoneNumber: phoneNumber.value,
    status: true,
  };
  if (clearUsername == true && clearPhoneNumber == true) {
    var htp = new XMLHttpRequest();

    htp.onreadystatechange = function () {
      if (htp.readyState == 4) {
        var response = JSON.parse(this.responseText);
        if (response.status == true) {
          window.location.href = "login.html";
        } else {
          console.log("erroe");
        }
      }
    };

    htp.open("post", "http://localhost:8048/InsertRegistration", true);
    htp.setRequestHeader("Content-Type", "application/json");
    htp.send(JSON.stringify(jsonData));
  }
}

function checkUserName() {
  var username = document.getElementById("userName");
  if (username.value != "") {
    var htp = new XMLHttpRequest();

    htp.onreadystatechange = function () {
      if (htp.readyState == 4) {
        var response = JSON.parse(htp.responseText);
        if (response.status == true) {
          clearUsername = true;
          username.style.borderColor = "";
          username.style.borderColor = "green";
        } else {
          clearUsername = false;
          username.style.borderColor = "";
          username.style.borderColor = "red";
        }
      }
    };

    htp.open(
      "get",
      "http://localhost:8048/checkUserName/" + username.value,
      true
    );
    htp.send();
  } else {
    console.log("write value");
  }
}

function checkPhoneNumber() {
  var phoneNumber = document.getElementById("phoneNumber");
  var htp = new XMLHttpRequest();

  htp.onreadystatechange = function () {
    if (htp.readyState == 4) {
      var response = JSON.parse(htp.responseText);
      if (response.status == true) {
        clearPhoneNumber = true;
        phoneNumber.style.borderColor = "";
        phoneNumber.style.borderColor = "green";
      } else {
        clearPhoneNumber = false;
        phoneNumber.style.borderColor = "";
        phoneNumber.style.borderColor = "red";
      }
    }
  };

  htp.open(
    "get",
    "http://localhost:8048/checkPhoneNumber/" + phoneNumber.value,
    true
  );
  htp.send();
}
