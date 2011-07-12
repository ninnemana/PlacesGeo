var map;
var location;
var markers = new Array();
var search_query;

$(document).ready(function(){

});

function get_location(){
	if(Modernizr.geolocation){
		navigator.geolocation.getCurrentPosition(show_map);
	}else{
		$('#map').html('<p>Your browser does not support geo-location</p>');
	}
}


