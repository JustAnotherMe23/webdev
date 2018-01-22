"use strict";

var chat_input = document.getElementById('chat_input');
var chat_comments = document.getElementById('chat_comments');

var commentGrayCounter = 0;

chat_input.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
        var chat_add = chat_input.value;
        var chat_current = chat_comments.innerHTML;
        
        if(commentGrayCounter ==0) {
            chat_comments.innerHTML = "<div class=\"comment gray\">" + chat_add + "</div>" + chat_current;
            commentGrayCounter = 1;
        } else {
            chat_comments.innerHTML = "<div class=\"comment\">" + chat_add + "</div>" + chat_current;
            commentGrayCounter = 0;
        }
        
        chat_input.value = "";
    }
});