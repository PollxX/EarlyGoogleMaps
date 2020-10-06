var map, low, high;
var counter = 0;
var markerCounter = 1;
var labelCounter = 0;
var colours = ["white","blue","red","green","yellow","orange","purple","grey","black"];
var Coords = { lat:51.4839186, lng:0 };
var markers = [];
var button4Count = 0;
var button5Check = false;

function initialise(){
    var mapDiv = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(Coords.lat,Coords.lng), 
        zoom: 12, 
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        disableDefaultUI: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP,
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.HYBRID,
                google.maps.MapTypeId.SATELLITE,
                google.maps.MapTypeId.TERRAIN
            ]
        }
    };
    map = new google.maps.Map(mapDiv, mapOptions);
    startPin();
}
google.maps.event.addDomListener(window, 'load', initialise);
google.maps.visualRefresh = true;

function getCounter(){
    markerCounter++;
    if (counter < 9){
        var temp = counter;
        counter++;
        return temp;
    } else {
        counter = 0;
        return 0;
    }
}

function startPin(){
    var input = new google.maps.LatLng(Coords.lat,Coords.lng);
    map.setOptions({center: input});
    
    markers.push(new google.maps.Marker({
        position: input,
        map: map,
        title: "Location number "+markerCounter,
        icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_'+colours[getCounter()]+'.png'
    }));

    var infwin;
    for (var k = 0; k < markers.length; k++){
        var nmark = markers[k];
        (function(k,nmark){
            google.maps.event.addListener (nmark, 'click',
                function(){
                    if (!infwin) infwin = new google.maps.InfoWindow();
                    infwin.setContent('<div class="info"> Marker '+(k+1)+': '+input+'</div>');
                    infwin.open(map, nmark);
                });
        })(k,nmark);
    }
}

//moves camera to user place, and makes marker there
function button1(){
    var input = new google.maps.LatLng(prompt("Latitude: "),prompt("Longitude: "));
    map.setOptions({center: input});
    labelCounter++;
    markers.push(new google.maps.Marker({
        position: input,
        map: map,
        title: "Location number "+markerCounter,
        icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_'+colours[getCounter()]+'.png',
		label: labelCounter.toString()
    }));

    var infwin;
    for (var k = 0; k < markers.length; k++){
        var nmark = markers[k];
        (function(k,nmark){
            google.maps.event.addListener (nmark, 'click',
                function(){
                    if (!infwin) infwin = new google.maps.InfoWindow();
                    infwin.setContent('<div class="info"> Marker '+(k+1)+': '+input+'</div>');
                    infwin.open(map, nmark);
                });
        })(k,nmark);
    }
}

//moves within 300km away from last marker
function button2(){
    var oldLat = markers[markers.length-1].position.lat();
    var oldLng = markers[markers.length-1].position.lng();
    while (true){
        var randomLat = Math.floor((Math.random() * 180 - 90) + 1);
        var randomLng = Math.floor((Math.random() * 360 - 180) + 1);
        if (kmDistance(oldLat,oldLng,randomLat,randomLng) < 300){
            var input = new google.maps.LatLng(randomLat,randomLng);
            map.setOptions({center: input});
            markers.push(new google.maps.Marker({
                position: input,
                map: map,
                title: "Location number "+markerCounter,
                icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_'+colours[getCounter()]+'.png'
            }));
            var infwin;
            for (var k = 0; k < markers.length; k++){
                var nmark = markers[k];
                (function(k,nmark){
                    google.maps.event.addListener (nmark, 'click',
                        function(){
                            if (!infwin) infwin = new google.maps.InfoWindow();
                            infwin.setContent('<div class="info"> Marker '+(k+1)+': '+input+'<br> Distance from previous: '+distBetween()+'km</div>');
                            infwin.open(map, nmark);
                        });
                })(k,nmark);
            }
            break;
        }
    }
    
}

//adds marker at antipode
function button3(){
    var oldLat = markers[markers.length-1].position.lat();
    var oldLng = markers[markers.length-1].position.lng();

    var newLat = oldLat * -1;
    var newLng = 180 + oldLng;
    var antipode = new google.maps.LatLng(newLat,newLng);
    map.setOptions({center: antipode});

    markers.push(new google.maps.Marker({
        position: antipode,
        map: map,
        title: "Location number "+markerCounter,
        icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_'+colours[getCounter()]+'.png'
    }));

    var infwin;
    for (var k = 0; k < markers.length; k++){
        var nmark = markers[k];
        (function(k,nmark){
            google.maps.event.addListener (nmark, 'click',
                function(){
                    if (!infwin) infwin = new google.maps.InfoWindow();
                    infwin.setContent('<div class="info"> Marker '+(k+1)+': '+antipode+'<br> Antipode of marker '+k+'</div>');
                    infwin.open(map, nmark);
                });
        })(k,nmark);
    }
}

//look, I know its global variables, and its bad practice -- "it just works"
var centerLat;
var centerLng;

function button4(){
    
    if (button4Count == 0){ //first time
        var input = new google.maps.LatLng(prompt("Latitude: "),prompt("Longitude: "));
        centerLat = input.lat();
        centerLng = input.lng();
        //console.log(centerLat+", "+centerLng);
        map.setOptions({center: input});
        
        markers.push(new google.maps.Marker({
            position: input,
            map: map,
            title: "Location number "+markerCounter,
            icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png'
        }));

        var infwin;
        for (var k = 0; k < markers.length; k++){
            var nmark = markers[k];
			google.maps.event.addListener (nmark, 'click', function(){
				if (!infwin) infwin = new google.maps.InfoWindow();
				infwin.setContent('<div class="info"> Marker '+(k+1)+': '+input+'</div>');
				infwin.open(map, nmark);
			});
        }

		var cornerLabel = "Top Left: ";
		var currentMarker = new google.maps.Marker({
		position: new google.maps.LatLng(centerLat+3,centerLng-3),
		map: map,
		icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green.png'
		});
		
		var info = new google.maps.InfoWindow();
		info.setContent(cornerLabel+currentMarker.getPosition());
		
		currentMarker.addListener('click', function(){
			info.open(map, currentMarker);
		});
		
		markers.push(currentMarker);

		//makes 4 green markers for each corner
		var cornerLabel2 = "Top Right: ";
		var currentMarker2 = new google.maps.Marker({
		position: new google.maps.LatLng(centerLat+3,centerLng+3),
		map: map,
		icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green.png'
		});
		
		var info2 = new google.maps.InfoWindow();
		info2.setContent(cornerLabel2+currentMarker2.getPosition());
		
		currentMarker2.addListener('click', function(){
			info2.open(map, currentMarker2);
		});
		
		markers.push(currentMarker2);

		var cornerLabel3 = "Bottom Left: ";
		var currentMarker3 = new google.maps.Marker({
		position: new google.maps.LatLng(centerLat-3,centerLng-3),
		map: map,
		icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green.png'
		});
		
		var info3 = new google.maps.InfoWindow();
		info3.setContent(cornerLabel3+currentMarker3.getPosition());
		
		currentMarker3.addListener('click', function(){
			info3.open(map, currentMarker3);
		});
		
		markers.push(currentMarker3);

		var cornerLabel4 = "Bottom Right: ";
		var currentMarker4 = new google.maps.Marker({
		position: new google.maps.LatLng(centerLat-3,centerLng+3),
		map: map,
		icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green.png'
		});
		
		var info4 = new google.maps.InfoWindow();
		info4.setContent(cornerLabel4+currentMarker4.getPosition());
		
		currentMarker4.addListener('click', function(){
			info4.open(map, currentMarker4);
		});
		
		markers.push(currentMarker4);

        button4Count++; //increments counter
    } else if (button4Count > 0){ //second time, places random ones
        var input;
        var random = Math.random() * 2 - 1;
        for (var i = 0; i < 4; i++){
            if (i == 0){ //top left
                random = Math.random() * random;
                input = new google.maps.LatLng(centerLat+Math.random() * 2 -random,centerLng-Math.random() * 2 -random);
            } else if (i == 1){ //top right
                random = Math.random() * random;
                input = new google.maps.LatLng(centerLat+Math.random() * 2 -random,centerLng+Math.random() * 2 -random);
            } else if (i == 2){ //bottom left
                random = Math.random() * random;
                input = new google.maps.LatLng(centerLat-Math.random() * 2 -random,centerLng-Math.random() * 2 -random);
            } else if (i == 3){ //bottom right
                random = Math.random() * random;
                input = new google.maps.LatLng(centerLat-Math.random() * 2 -random,centerLng+Math.random() * 2 -random);
            }

            markers.push(new google.maps.Marker({
                position: input,
                map: map,
                icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_black.png'
            }));
        }
        //and 4 information windows

    }
}

var timesClicked5 = 1;
function button5(){
    //"When pressed for the first time..."
	timesClicked5++;
    var mapArray = new google.maps.MVCArray(); //this button allows theuser to add contour points interactively delimiting a geographical area
    var mapPoly = new google.maps.Polygon({ //Both perimeter and area of the delimited region must have different colours.
        path: mapArray,
        strokeColor: "#00ff00",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: "#133337",
        fillOpacity: 0.45,
        map: map
    });

    mOverList = google.maps.event.addListener(mapPoly, 'mouseover', function(ev){ //When the mouse enters the region, the colour of the region mustchange
		mapPoly.setOptions({
			strokeColor: "#690000",
			fillColor: "#420000",
			fillOpacity: 0.4
		});
		if (timesClicked5 % 2){	
			var eMarker = new google.maps.Marker({
				position: new google.maps.LatLng(ev.latLng.lat(),ev.latLng.lng()),
				map: map,
				icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png'
			});
		}
    });

    mOutList = google.maps.event.addListener(mapPoly, 'mouseout', function(){ // it will revert back to the original colour when the mouse is again outside the region.
        mapPoly.setOptions({
            strokeColor: "#00ff00",
            fillColor: "#133337",
            fillOpacity: 0.45
        });
    });

    if(!button5Check){ //Each time the user enters the region of space with the mouse, markers are added at the location of the mouse.
        drawListener = google.maps.event.addListener(map, 'click', function(e){
            if (button5Check){
                mapPoly.getPath().push(e.latLng);
            }
        });
        mOverList = null;
        mOutList = null;
        button5Check = true;
    }else{ //Pressing Button 5 a second time disables the process.
        drawListener = null;
        button5Check = false;
    }
}

/*When pressed the button prompts the user for two locations, the source and destination of a given route, 
an array of coordinates that specify each  route  between  the given source  and  destination locations.  Implement a  method 
to  extract panoramic images from each location. You will need to develop code that displays the given routes, using polylines of different colour. 
For each location, including source and destination, you will have to add a marker of a different colour and for 
each  marker an information  window  (infoWindow).  Each  infoWindow  will  have  to  display 
the Street View image taken by Googleat that given location. The display in the InfoWindow will have to 
use HTML5 and also include a horizontal slider that can show only a part of the panoramic image.*/

var oneTime = true;
var inputs = [];

function helper6(marker, infoWindow){
	var panorama = null;
	var MVC = new google.maps.MVCObject;
	var svElement = document.createElement('DIV');
	svElement.style.height = "800px";
	svElement.style.width = "600px";
	
	infoWindow = new google.maps.InfoWindow({
		content: svElement
	});
	
	google.maps.event.addListenerOnce(infoWindow,"domready",function(){
		panorama = new google.maps.StreetViewPanorama(svElement,{
			visible: true,
			navigationControl: false,
			linksControl: false,
			addressControl: false
		});
		panorama.bindTo("position",MVC);
	});
	google.maps.event.addListener(marker,'click',function(){
		MVC.set("position",marker.getPosition());
		infoWindow.open(map,marker);
	});
}

function button6(){
    var checker = prompt("Do you want to add a new marker location?","Y/N");
    if (!(checker == "No" || checker == "no" || checker == "N" || checker == "n" || checker == "Yes" || checker == "yes" || checker == "Y" || checker == "y")){
        return;
    } else if (checker == "No" || checker == "no" || checker == "N" || checker == "n" ){ //finishes routing
        map.setOptions({center: inputs[inputs.length-1]}); //moves camera to last place
        var routing = new google.maps.Polyline({ //makes line joining markers
            map: map,
            path: inputs,
            strokeColor: "#"+(Math.random()*0xFFFFFF<<0).toString(16),
            strokeOpacity: 1,
            strokeWeight: 10,
        });
        inputs = []; //empty array for new route
    } else {
        if(oneTime){ //info for user
            alert("Add co-ordinates or click the button again and type N for No to stop");
            oneTime = false;
        }

        var input = new google.maps.LatLng(prompt("Latitude: "),prompt("Longitude: "));
        map.setOptions({center: input});
        inputs.push(input);
        var newMark;
        markers.push(newMark = new google.maps.Marker({
            position: input,
            map: map,
            title: "Location number "+markerCounter,
            icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_'+colours[getCounter()]+(inputs.length)+'.png'
        }));

        //adds basic streetview of location
		helper6(newMark,new google.maps.InfoWindow());
    }
}

function changeMapType(type){
    if (type == 0){
        map.setOptions({mapTypeId: google.maps.MapTypeId.ROADMAP});
    } else if (type == 1){
        map.setOptions({mapTypeId: google.maps.MapTypeId.HYBRID});
    } else if (type == 2){
        map.setOptions({mapTypeId: google.maps.MapTypeId.SATELLITE});
    } else if (type == 3){
        map.setOptions({mapTypeId: google.maps.MapTypeId.TERRAIN});
    }
}

function setBounds(){
    low = prompt("Minimum bounds ");
    high = prompt("Maximium bounds ");
    //inclusive of both min and max values from user
    random = Math.Floor(Math.random() * (high - low + 1)) + low;
    
    document.getElementById("output").innerHTML = random;
}

function returnHome(){
    map.setOptions({center: new google.maps.LatLng(Coords.lat,Coords.lng)});
    map.setOptions({zoom: 12});
}

function moveMap(){
    map.setOptions({center: new google.maps.LatLng(prompt("Latitude: "),prompt("Longitude: "))});
}

function zoomTo(){
    var zoomer = parseInt(prompt("Change Zoom (from 0 to 21): "));
    if (zoomer < 22 && zoomer > -1){
        map.setOptions({zoom: zoomer });
    }
}

function kmDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344; //for Km

        return dist;
    }
}

function distBetween(){ //the distance between the last 2 markers (in km)
    if (markers.length > 1){
        var firLat = markers[markers.length-2].position.lat();
        var firLng = markers[markers.length-2].position.lng();
        var secLat = markers[markers.length-1].position.lat();
        var secLng = markers[markers.length-1].position.lng();
        return kmDistance(firLat,firLng,secLat,secLng);
    }
}