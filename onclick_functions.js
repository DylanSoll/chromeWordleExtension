"use strict"

//function <buttonid>(){code}



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
    document.getElementById('ws_stats_settings_cont').setAttribute('hidden', true);
    document.getElementById('ws_colour_settings_cont').removeAttribute('hidden');
    return
}

function ws_stats_settings_btn(){
    document.getElementById('ws_main_settings_cont').setAttribute('hidden', true);
    document.getElementById('ws_colour_settings_cont').setAttribute('hidden', true);
    document.getElementById('ws_stats_settings_cont').removeAttribute('hidden');
    return
}

function ws_stats_back(){
    document.getElementById('ws_colour_settings_cont').setAttribute('hidden', true);
    document.getElementById('ws_stats_settings_cont').setAttribute('hidden', true);
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