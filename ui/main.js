var button = document.getElementById('counter');

button.onclick= function(){
//create a request
var request= new XMLHttpRequest();

//capture the response 
request.onreadystatechange = function (){
    if (request.readyState === XMLHttpRequest.DONE)
        if (request.status=== 200){
            var counter =request.responseText;
            var span = document.getElementById('count');
            span.innerHTML=counter.toString();
        }
}
//make the request
request.open('GET','http://localhost:8080/counter',true);
request.send(null);
};