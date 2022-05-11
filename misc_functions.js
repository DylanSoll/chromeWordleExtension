"use strict"

function use_message_box(message){
    const message_box = document.getElementById('ws_message_box');
    message_box.removeAttribute('hidden');
    message_box.innerHTML = message;
    window.setTimeout(function(){message_box.setAttribute('hidden', true)}, 5000);
    return
}

