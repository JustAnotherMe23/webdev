"use strict";

var chat_input = document.getElementById('chat_input');
var chat_comments = document.getElementById('chat_comments');

var commentGrayCounter = 0;
var socket = io();

var userID = null;
var username = null;
var room = "general";

window.fbAsyncInit = function() {
    FB.init({
        appId      : '166266750802491',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.11'
    });
      
    FB.AppEvents.logPageView();   
    
    FB.getLoginStatus(function(response) {
        if(response.status === 'connected') {
            userID = response.authResponse.userID;
            socket.emit("request_username", {userID: userID + ""});
        } else if(response.status === 'not_authorized') {
        } else {
            document.getElementById("login_button").classList.remove("hide");
            document.getElementById("login_button_wrapper").classList.remove("hide");
            document.getElementById("login_block").classList.remove("hide");
        }
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function login() {
    FB.login(function(response) {
        if(response.status === 'connected') {
            userID = response.authResponse.userID;
            socket.emit("request_username", {userID: userID + ""});
            document.getElementById("login_button").className += "hide";
            document.getElementById("login_button_wrapper").className += "hide";
            document.getElementById("login_block").className += "hide";
        } else if(response.status === 'not_authorized') {
        } else {
        }
    });
}

/*------Facebook Login Protocol End-------*/

chat_input.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if(key === 13) { // 13 is enter
        requestUsername();
        var msg = chat_input.value;
        socket.emit('make_comment', {writer: username, msg: msg});
        chat_input.value = "";
    }
});

var vote_input = document.getElementById('vote_input');
vote_input.addEventListener('keypress', function(e) {
    var key = e.which || e.keyCode;
    if(key === 13) {
        requestUsername();
        var upvote = vote_input.value;
        socket.emit('make_vote', {userID: userID, room: room, upvote: upvote});
        vote_input.value = "";
    }
});

var vote_button = document.getElementById('vote_button');
vote_button.addEventListener('click', function () {
    requestUsername();
    var upvote = vote_input.value;
    socket.emit('make_vote', {userID: userID, room: room, upvote: upvote});
    vote_input.value = "";
});

var navItems = document.getElementsByClassName('nav_item');
var bodyItems = document.getElementsByClassName('body_item');
for(let i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener('click', function() {
        for(var a = 0; a < bodyItems.length; a++) {
            if(a == i) {
                bodyItems[a].classList.remove("hide");
                navItems[a].classList.add("depressed");
            } else {
                bodyItems[a].classList.add("hide");
                navItems[a].classList.remove("depressed");
            }
        }
    })
}



socket.on("add_comment", function(comment) {
    var chat_current = chat_comments.innerHTML;
        
    if(commentGrayCounter == 0) {
        chat_comments.innerHTML = "<div class=\"comment gray\"><span class=\"bold\">" + comment["writer"] + ": </span>" + comment["msg"] + "</div>" + chat_current;
        commentGrayCounter = 1;
    } else {
        chat_comments.innerHTML = "<div class=\"comment\"><span class=\"bold\">" + comment["writer"] + ": </span>" + comment["msg"] + "</div>" + chat_current;
        commentGrayCounter = 0;
    }
});

socket.on("send_username", function(object) {
    username = object.username;
})


socket.on('refresh', function() {
    location.reload();
})

var requestUsername = function() {
    
    var valid = true;
    var sendInfo = false;
    if(username === null) {
        valid = false;
    }
    
    while(!valid) {
        username = prompt("Please enter a username: ");
        if(username != "" && username != null) {
            valid = true;
        }
        sendInfo = true;
    }
    
    if(sendInfo) {
        socket.emit("set_username", {userID: userID, username: username});
    }
};

var iframeElement = document.querySelector('iframe');
var widget = SC.Widget(iframeElement);

widget.bind(SC.Widget.Events.READY, function() {
    widget.getDuration(function(duration) {
        socket.emit('set_start', {
            time: Date.now(),
            duration: duration,
            room: room
        });
    });
});

socket.on('play', function(object) {
    widget.seekTo(object.seek);
    //widget.play();
})
