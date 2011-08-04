var map;
var location;
var markers = new Array();
var places_markers = new Array();
var search_query;
var lat_lon;
var latitude;
var longitude;
var infowindow;
var marker;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();


$(document).ready(function(){
    get_location();
    
    $('#search_query').live('keyup',function(){
        clearPlaces();
        var request = {
            location: lat_lon,
            radius: 5000,
            name: $(this).val()
        };
        var places_service = new google.maps.places.PlacesService(map);
        places_service.search(request,loadPlaces);
    });
    
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('search_query'));
    google.maps.event.addListener(autocomplete,'place_changed',function(){
        clearPlaces();
        var place = autocomplete.getPlace();
        if(place.geometry.viewport){
            map.fitBounds(place.geometry.viewport);
        }else{
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        var image = new google.maps.MarkerImage(
            place.icon, new google.maps.Size(71,71),
            new google.maps.Point(0,0), new google.maps.Point(17,34),
            new google.maps.Size(35,35));
        var marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            image: image,
            animation: google.maps.Animation.DROP,
            title: place.name
        });
        marker.setIcon(image);
        marker.setPosition(place.geometry.location);
        
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent(place.name);
        infowindow.open(map,marker);
        
        // Load directions
        var start = new google.maps.LatLng(latitude,longitude);
        var end = place.geometry.location;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(result, status){
            if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(result);   
            }
        });
    });
    
    $('tbody').find('tr').live('click',function(){
        var place_id = $(this).attr('id');
        console.log(place_id);
    });
});

function get_location(){
	if(Modernizr.geolocation){
		navigator.geolocation.getCurrentPosition(show_map);
	}else{
		$('#map').html('<p>Your browser does not support geo-location</p>');
	}
}

function show_map(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    
    directionsDisplay = new google.maps.DirectionsRenderer();
    
    lat_lon = new google.maps.LatLng(latitude,longitude);
    var options = {
        center: lat_lon,
        zoom: 11,
        MapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map'),options);
    directionsDisplay.setMap(map);
    
    var home_image = 'gmap_blue_icon.png';
    var marker = new google.maps.Marker({
      position: lat_lon, 
      map: map, 
      image: home_image,
      title:"You are here!",
      animation: google.maps.Animation.BOUNCE
  });   
}

function loadPlaces(results, status){
    if(status == google.maps.places.PlacesServiceStatus.OK){
        $('table').find('tbody').html('');
        $.each(results,function(i, place){
            createMarker(place);
            addTableRow(place);
        });   
    }
}

function createMarker(place){
    var marker = new google.maps.Marker({
        position: place.geometry.location,
        map:map,
        image: place.icon,
        title: place.name,
        animation: google.maps.Animation.DROP
    });
    places_markers[place.id] = marker;    
    google.maps.event.addListener(marker,'click',function(){
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent(marker.getTitle());
        infowindow.open(map,marker);    
    });
}

function addTableRow(place){
    var html = '<tr id="'+place.id+'"><td>'+place.name+'</td><td>'+ place.vicinity+'</td><td>';
    $.each(place.types,function(i,type){
        html += type;
        if((i + 1) != place.types.length){
            html += ', ';
        }
    });
    $('table').find('tbody').append(html);
}

function clearPlaces(){
    $.each(places_markers,function(i,marker){
        if(marker != undefined){
            marker.setMap(null);    
        }
        places_markers[i] = null;
    });   
}
