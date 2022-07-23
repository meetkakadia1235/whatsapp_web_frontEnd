var ourId = parseInt(sessionStorage.getItem("id"));
var conversationChatId = 0;
var conversationChatUserName = "";
var conversationChatList = [];
var chatUserList = [];
var newUserList = [];
var allChatList = [];

setInterval(function () {
  checkId();
}, 2000);

function checkId() {
  var htp = new XMLHttpRequest();

  htp.onreadystatechange = function () {
    if (htp.readyState == 4) {
      var response = JSON.parse(htp.responseText);
      var data = response.data;
      var list = [];
      for (var i = 0; i < data.length; i++) {
        var status = false;
        for (var j = 0; j < list.length; j++) {
          if (data[i].from.id === list[j][0]) {
            status = true;
          } else if (data[i].to.id === list[j][0]) {
            status = true;
          }
        }
        if (status == false) {
          if (data[i].from.id === parseInt(ourId)) {
            var jsonData = [data[i].to.id, data[i].to.username];
            list.push(jsonData);
          } else {
            var jsonData = [data[i].from.id, data[i].from.username];
            list.push(jsonData);
          }
        }
      }
      chatUserList = list;
      setData(list);
    }
  };
  htp.open("get", "http://localhost:8048/getMessages/" + ourId, true);
  htp.send();
}

function setHedding() {
  var conversations = document.getElementById("conversations");
  conversations.innerHTML =
    `<div class="row heading">
  <div class="col-sm-2 col-md-1 col-xs-3 heading-avatar">
    <div class="heading-avatar-icon">
      <img src="https://bootdey.com/img/Content/avatar/avatar6.png">
    </div>
  </div>
  <div class="col-sm-8 col-xs-7 heading-name">
    <a class="heading-name-meta">` +
    conversationChatUserName +
    `
    </a>
    <span class="heading-online">Online</span>
  </div>
  <div class="col-sm-1 col-xs-1  heading-dot pull-right">
    <i class="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i>
  </div></div>`;
}

function setId(id) {
  conversationChatId = parseInt(id);
  for (var i = 0; i < chatUserList.length; i++) {
    if (chatUserList[i][0] == parseInt(id)) {
      conversationChatUserName = chatUserList[i][1];
    }
  }
  setHedding();
  changeList();
}

function setData(list) {
  var chatMenu = document.getElementById("chatMenu");
  chatMenu.innerHTML = "";
  for (var j = 0; j < list.length; j++) {
    chatMenu.innerHTML +=
      `<div class="row sideBar-body" name="chatMenus" id="` +
      list[j][0] +
      `" onclick="setId(this.id)">
        <div class="col-sm-3 col-xs-3 sideBar-avatar">
          <div class="avatar-icon">
            <img src="https://bootdey.com/img/Content/avatar/avatar1.png">
          </div>
        </div>
        <div class="col-sm-9 col-xs-9 sideBar-main">
          <div class="row">
            <div class="col-sm-8 col-xs-8 sideBar-name">
              <span class="name-meta">` +
      list[j][1] +
      `
              </span>
            </div>
            <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
              <span class="time-meta pull-right">18:18
              </span>
            </div>
          </div>
        </div>
        </div>`;
  }
}

setInterval(function () {
  if (conversationChatId == 0) {
    console.log("not done");
    conversationChatList = [];
  } else {
    var htp = new XMLHttpRequest();

    htp.onreadystatechange = function () {
      if (htp.readyState == 4) {
        var response = JSON.parse(htp.responseText);
        var data = response.data;
        var list = [];
        for (var i = data.length - 1; i >= 0; i--) {
          if (
            data[i].from.id == conversationChatId ||
            data[i].to.id == conversationChatId
          ) {
            list.push(data[i]);
          }
        }
        if (JSON.stringify(conversationChatList) != JSON.stringify(list)) {
          conversationChatList = list;
          changeList();
        }
      }
    };
    htp.open("get", "http://localhost:8048/getMessages/" + ourId, true);
    htp.send();
  }
}, 1000);

function changeList() {
  var conversations = document.getElementById("conversations");
  conversations.innerHTML += `<div class="row message" id="conversationChat"></div>`;
  var conversationChat = document.getElementById("conversationChat");
  conversationChat.innerHTML = "";
  for (var i = 0; i < conversationChatList.length; i++) {
    var myDate = new Date(conversationChatList[i].date);
    if (conversationChatList[i].from.id == ourId) {
      conversationChat.innerHTML +=
        `<div class="row message-body">
      <div class="col-sm-12 message-main-sender">
      <div class="sender">
      <div class="message-text">
      ` +
        conversationChatList[i].message +
        `
          </div>
          <span class="message-time pull-right">
          ` +
        myDate.getTime() +
        `
          </span>
          </div>
          </div>
          </div>`;
    } else {
      conversationChat.innerHTML +=
        `<div class="row message-body">
        <div class="col-sm-12 message-main-receiver">
          <div class="receiver">
          <div class="message-text">
          ` +
        conversationChatList[i].message +
        `
        </div>
        <span class="message-time pull-right">
        ` +
        myDate.getTime() +
        `
        </span>
        </div>
        </div>
        </div>`;
    }
  }
  conversations.innerHTML += `<div class="row reply">
      <div class="col-sm-1 col-xs-1 reply-emojis">
        <i class="fa fa-smile-o fa-2x"></i>
      </div>
      <div class="col-sm-9 col-xs-9 reply-main">
        <textarea class="form-control" rows="1" id="comment"></textarea>
      </div>
      <div class="col-sm-1 col-xs-1 reply-recording">
        <i class="fa fa-microphone fa-2x" aria-hidden="true"></i>
      </div>
      <div class="col-sm-1 col-xs-1 reply-send">
        <i class="fa fa-send fa-2x" aria-hidden="true" onclick="sendMessage()"></i>
      </div>
    </div>`;
}

function sendMessage() {
  var comment = document.getElementById("comment");
  var jsonData = {
    from: {
      id: ourId,
    },
    to: {
      id: conversationChatId,
    },
    message: comment.value,
    status: true,
  };

  var htp = new XMLHttpRequest();
  htp.open("post", "http://localhost:8048/sendMessage", true);
  htp.setRequestHeader("Content-Type", "application/json");
  htp.send(JSON.stringify(jsonData));
}

function getNewChatUser(username) {
  var newChatUserSideBar = document.getElementById("newChatUserSideBar");
  if (username != "") {
    var htp = new XMLHttpRequest();

    htp.onreadystatechange = function () {
      if (htp.readyState == 4) {
        var response = JSON.parse(htp.responseText);
        var data = response.data;
        var list = [];
        for (var i = 0; i < data.length; i++) {
          var status = false;
          if (data[i][0] == ourId) {
            status = true;
          } else {
            for (var j = 0; j < chatUserList.length; j++) {
              if (JSON.stringify(data[i]) == JSON.stringify(chatUserList[j])) {
                status = true;
              }
            }
          }
          if (status == false) {
            list.push(data[i]);
          }
        }
        newUserList = list;
        console.log(newUserList);
        newChatUserSideBar.innerHTML = "";
        for (var i = 0; i < list.length; i++) {
          newChatUserSideBar.innerHTML +=
            `<div class="row sideBar-body" id="` +
            list[i][0] +
            `" onclick="setNewId(this.id)">
        <div class="col-sm-3 col-xs-3 sideBar-avatar">
          <div class="avatar-icon">
            <img src="https://bootdey.com/img/Content/avatar/avatar5.png">
          </div>
        </div>
        <div class="col-sm-9 col-xs-9 sideBar-main">
          <div class="row">
            <div class="col-sm-8 col-xs-8 sideBar-name">
              <span class="name-meta">` +
            list[i][1] +
            `
              </span>
            </div>
            <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
              <span class="time-meta pull-right">18:18
              </span>
            </div>
          </div>
        </div>
      </div>`;
        }
      }
    };
    htp.open("get", "http://localhost:8048/searchOtherUser/" + username, true);
    htp.send();
  } else {
    newChatUserSideBar.innerHTML = "NO USER FOUND";
  }
}

function setNewId(id) {
  conversationChatId = parseInt(id);

  for (var i = 0; i < newUserList.length; i++) {
    if (newUserList[i][0] == parseInt(id)) {
      conversationChatUserName = newUserList[i][1];
    }
  }
  setHedding();
  changeList();
}
