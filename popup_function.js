function defaulthandler(results)
{
    console.log(results);
}
function create_form_data(){
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

function get_ip(){
    var ip = document.getElementById('ip_holder').value
    return ip
}



document.getElementById('forward').addEventListener('click', function(){
    new_ajax_helper('http://'+get_ip()+'/forward')
})
document.getElementById('backward').addEventListener('click', function(){
    new_ajax_helper('http://'+get_ip()+'/reverse')
})
document.getElementById('left').addEventListener('click', function(){
    new_ajax_helper('http://'+get_ip()+'/left')
})
document.getElementById('right').addEventListener('click', function(){
    new_ajax_helper('http://'+get_ip()+'/right')
})
document.getElementById('ip_holder').addEventListener('input', function(){

    console.log(get_ip())
    try{
        document.getElementById("videofeed").innerHTML = '<img src="http://'+get_ip()+'/videofeed" width=75% />'
    }catch(err) {
        document.getElementById("videofeed").innerHTML = err.message;
      }
    
})
