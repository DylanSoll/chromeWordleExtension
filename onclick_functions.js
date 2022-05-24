"use strict"

//function <buttonid>(){code}

var allow_stats = true


function open_settings(){
    chrome.storage.local.get(['settings'], function(){
        document.getElementById('ws_settings_box').removeAttribute('hidden');
        document.getElementById('ws_dialog_box').removeAttribute('hidden');
        document.getElementById('ws_stats_box').setAttribute('hidden', true);
    });
    return
}


function ws_colour_settings_btn(){
    document.getElementById('ws_main_settings_cont').setAttribute('hidden', true);
    document.getElementById('ws_colour_settings_cont').removeAttribute('hidden');
    return
}

function ws_stats_back(){
    document.getElementById('ws_colour_settings_cont').setAttribute('hidden', true);
    document.getElementById('ws_main_settings_cont').removeAttribute('hidden');
    return
}

function ws_colour_back(){
    document.getElementById('ws_colour_settings_cont').setAttribute('hidden', true);
    document.getElementById('ws_stats_settings_cont').setAttribute('hidden', true);
    document.getElementById('ws_main_settings_cont').removeAttribute('hidden');
    return
}


function open_stats(){
    chrome.storage.local.get(['statistics'], function(result){
        document.getElementById('ws_stats_box').removeAttribute('hidden')
        document.getElementById('ws_dialog_box').removeAttribute('hidden')
        document.getElementById('ws_settings_box').setAttribute('hidden', true)

        const stats = result['statistics']
        var total_won = 0;
        for (var pos = 1; pos < 7; pos++){
            document.getElementById('correct-in-'+pos+'-stats').innerHTML = stats['distribution'][pos]
            total_won += parseInt(stats['distribution'][pos])
        }
        document.getElementById('games-won').innerHTML =  total_won + "/" + String(stats['games_played'])
    });
    return
}


function clear_stats(){
    const statistics = {'games_played': 1, 'distribution': 
        {'failed': 0, '1':0, '2':0, '3':0, '4':0, '5':0, '6':0}};
    for (var pos = 1; pos < 7; pos++){
        document.getElementById('correct-in-'+pos+'-stats').innerHTML = 0
    }
    document.getElementById('games-won').innerHTML =  0 + "/" + String(1);
    chrome.storage.local.set({'statistics': statistics});
    return
}


function show_selected_btn(selected_id){
    const currently_active = document.getElementsByClassName('btn-selected')[0];
    if (currently_active != null){
        currently_active.className = currently_active.className.split('btn-selected')[0];
    }
    document.getElementById(selected_id).className += ' btn-selected';
    return
}

function reset_colour_settings(){
    convert_obj_to_style(dark_mode);
    show_selected_btn('ws_to_dark_mode');
    clear_colour_settings();
    update_colours();
    return
}

function save_colour_settings(){
    var selected_style_id = document.getElementById('ws_style_toggle').getElementsByClassName('btn primary btn-selected')[0].id;
    var colour_inputs = document.getElementById('custom_colour_container').getElementsByTagName('input');
    var new_custom = {};
    for (var elem = 0; elem < colour_inputs.length; elem++){
        const input = colour_inputs[elem];
        const target = input.getAttribute('data-target');
        const value = input.value;
        new_custom[target] = value;
    };
    const new_active = selected_style_id.split("ws_to_")[1]
    const colour_settings = {
        'active':new_active, 
        'dark_mode':dark_mode, 
        'light_mode':light_mode, 
        'custom_mode':new_custom
    };
    chrome.storage.local.get(['settings'], function(result){
        result.settings.colours = colour_settings;
        chrome.storage.local.set(result)
    })
    return
}

function toggle_switches(switch_id){
    const switch_span = document.getElementById(`${switch_id}_span`)
    if (switch_span.getAttribute('data-checked') === "true"){
        switch_span.setAttribute('data-checked', false);
        return false
    }
    switch_span.setAttribute('data-checked', "true");
    return true
}

function toggle_statistics(){
    const checked = toggle_switches('toggle_statistics')
    chrome.storage.local.get('settings', function(result){
        var settings = result['settings'];
        settings['statistics']['allow_stats'] = checked;
        chrome.storage.local.set({'settings':settings});
        clear_stats();
    })
    return checked;
}

function full_reset(){
    chrome.storage.local.clear()
    window.close()
    return
}

function open_colour_settings(){
    const container = document.getElementById('ws_colour_settings_cont');
    container.removeAttribute('hidden');
    document.getElementById('ws_main_settings_cont').setAttribute('hidden', true);
    document.getElementById('back_to_main_settings').removeAttribute('hidden');
    return
}

function open_animations_settings(){
    const container = document.getElementById('ws_animations_settings_cont');
    container.removeAttribute('hidden');
    document.getElementById('ws_main_settings_cont').setAttribute('hidden', true);
    document.getElementById('back_to_main_settings').removeAttribute('hidden');
    return
}

function back_to_main_settings(){
    document.getElementById('back_to_main_settings').setAttribute('hidden', true);
    document.getElementById('ws_animations_settings_cont').setAttribute('hidden', true);
    document.getElementById('ws_colour_settings_cont').setAttribute('hidden', true);
    document.getElementById('ws_main_settings_cont').removeAttribute('hidden');    
    return
}