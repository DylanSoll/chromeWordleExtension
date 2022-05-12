"use strict"


const light_mode = {
    '--partial-correct': 'rgb(242, 255, 59)',
    '--incorrect': 'rgb(98, 98, 98)',
    '--correct': 'rgb(21, 123, 0)',
    '--primary': 'rgb(33, 47, 255)',
    '--background': 'rgb(222, 222, 222)',
    '--close': 'rgb(0, 0, 0)',
    '--success': 'rgb(0, 222, 15)',
    '--warning': '#ed5f00',
    '--border-colour': 'black',
    '--text-colour': '#000000'
}

const dark_mode = {
    '--partial-correct': '#b59f3b',
    '--incorrect': '#626262',
    '--correct': '#157b00',
    '--primary': '#000dc3',
    '--background': '#050015',
    '--close': '#ffffff',
    '--success': '#00de0f',
    '--warning': '#ed5f00',
    '--border-colour': '#ffffff',
    '--text-colour': '#ffffff'
}

const custom_style = {
    '--partial-correct': '#b59f3b',
    '--incorrect': '#626262',
    '--correct': '#157b00',
    '--primary': '#000dc3',
    '--background': '#050015',
    '--close': '#ffffff',
    '--success': '#00de0f',
    '--warning': '#ed5f00',
    '--border-colour': '#ffffff',
    '--text-colour': '#ffffff'
}

const default_colour_settings = {
    'active':'dark_mode', 
    'dark_mode':dark_mode, 
    'light_mode':light_mode, 
    'custom_mode':custom_style
}

function use_message_box(message){
    const message_box = document.getElementById('ws_message_box');
    message_box.removeAttribute('hidden');
    message_box.innerHTML = message;
    window.setTimeout(function(){message_box.setAttribute('hidden', true)}, 5000);
    return
}

function convert_obj_to_style(style_obj){
    const style_tag = document.getElementById('style_for_custom_css');
    const obj_keys = Object.keys(style_obj);
    var output = ":root{";
    for (var iter = 0; iter < obj_keys.length; iter++){
        output += `${obj_keys[iter]}: ${style_obj[obj_keys[iter]]};\n`
    }
    output +='}'
    style_tag.innerHTML = output;
    return
}



function ws_to_dark_mode(){
    convert_obj_to_style(dark_mode);
    show_selected_btn('ws_to_dark_mode');
    return
}

function ws_to_light_mode(){
    convert_obj_to_style(light_mode);
    show_selected_btn('ws_to_light_mode');
    return
}


function clear_colour_settings(){
    chrome.storage.local.get('settings', function(result){
        result.settings['colours'] = default_colour_settings;
        chrome.storage.local.set(result);
    });
    return
}

function clear_settings(){
    const blank_settings = {'settings':
        {'colours': default_colour_settings,
        'statistics': {'allow_stats':true}
        }
    };
    chrome.storage.local.set(blank_settings);
    return blank_settings
}

function update_colours(){
    var colour_inputs = document.getElementById('custom_colour_container').getElementsByTagName('input');
    for (var elem = 0; elem < colour_inputs.length; elem++){
        const input = colour_inputs[elem];
        input.value = custom[input.getAttribute('data-target')]
    }
}