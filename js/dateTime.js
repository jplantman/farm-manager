var dtElem = $('.dateTime');



let keepDateTime = function(){
	d = new Date();
	dtElem.html( d.toLocaleTimeString()+ ' - ' + d.toString().substr(0, 15) );	
}
keepDateTime();
setInterval( keepDateTime, 1000 );



