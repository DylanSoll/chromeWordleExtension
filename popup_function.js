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

function create_button(label, path){
    var new_path = "http://"+get_ip+"/"+path
    var new_button = document.createElement('button')
    new_button.innerHTML = label
    new_button.className="button pointer"
    document.getElementById('button_div').appendChild(new_button)
    new_button.addEventListener('click', function(){
        new_ajax_helper(new_path)
    })
}

document.getElementById('add_button').addEventListener('click', function(){
    create_button(document.getElementById('label').value,document.getElementById('path').value)
})
document.getElementById('ip_holder').addEventListener('input', function(){

    console.log(get_ip())
    try{
        document.getElementById("videofeed").innerHTML = '<img src="http://'+get_ip()+'/videofeed" width=75% />'
    }catch(err) {
        document.getElementById("videofeed").innerHTML = err.message;
      }
    
})
