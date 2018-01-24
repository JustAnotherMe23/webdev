"use strict";

window.fbAsyncInit = function() {
    FB.init({
        appId      : '166266750802491',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.11'
    });
      
    FB.AppEvents.logPageView();   
    
    FB.getLoginStatus(function(response) {
        console.log(response)
        if(response.status === 'connected') {
        } else if(response.status === 'not_authorized') {
        } else {
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
        console.log(response)
        if(response.status === 'connected') {
            document.getElementById("login_button").className += "hide";
            document.getElementById("submit_username").classList.remove("hide");
        } else if(response.status === 'not_authorized') {
        } else {
        }
    });
}

/*------Facebook Login Protocol End-------*/

var chat_input = document.getElementById('chat_input');
var chat_comments = document.getElementById('chat_comments');

var commentGrayCounter = 0;
var socket = io();

chat_input.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if(key === 13) { // 13 is enter
        var msg = chat_input.value;
        socket.emit('make_comment', {writer: "writer", msg: msg});
        chat_input.value = "";
    }
});

var vote_input = document.getElementById('vote_input');
vote_input.addEventListener('keypress', function(e) {
    var key = e.which || e.keyCode;
    if(key === 13) {
        var vote = vote_input.value;
        socket.emit('make_vote', {writer: "writer", vote: vote});
        vote_input.value = "";
    }
})

var vote_button = document.getElementById('vote_button');
vote_button.addEventListener('click', function () {
    var vote = vote_input.value;
    socket.emit('make_vote', {writer: "writer", vote: vote});
    vote_input.value = "";
});

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