function defaulthandler(results)
{
    console.log(results);
}
function create_form_data(testinput){
    testform = document.getElementById('testform'); //get the form element
    var fd = new FormData(testform); //create a form object since one does not exist
    fd.append("testinput", testinput); //to add an individual variable use a key and value
    return fd
}
function new_ajax_helper(url, callback=defaulthandler, formobject=null, method='POST')
{
    
    //create a request object
    var xhr = new XMLHttpRequest();

    xhr.open(method, url, true);
    xhr.onreadystatechange = function() //callback function
    {
        if (xhr.readyState == 4) //4 means data received
        {
            results = JSON.parse(xhr.responseText); //change JSON into a Javascript object
            callback(results); //call the callback function
        }
    }
    xhr.send(formobject); //send the form data
}


chrome.runtime.onInstalled.addListener(()=>{
    console.log('running')
})

document.getElementById('tester').addEventListener('click', function(){
    new_ajax_helper('https://dsdg.pythonanywhere.com/load_messages', console.log, create_form_data('hit'))
})