touchMapLite.prototype.findLocationHandler = function(e) {
	if(typeof(navigator.geolocation) != "undefined" && findOnMap != null){
		  navigator.geolocation.getCurrentPosition(this.recenterLonLat, this.nolocationFound);
	} else {
		alert('no geolocation service')
	}
	return false;
};

touchMapLite.prototype.watchLocationHandler = function(e) {
	if(typeof(navigator.geolocation) != "undefined"){
		if(!watchId && findOnMap != null){
			watchId = navigator.geolocation.watchPosition(this.recenterLonLat);
			return true;
		} else {
			navigator.geolocation.clearWatch(watchId);
			watchId = false;
		}
	} else {
		alert('no geolocation service')
	}
	return false;
};

touchMapLite.prototype.nolocationFound = function(error){
	if(error.code!=0){
		alert('cannot determin current location ['+error.code+']');
	} else {
		return false;
	}
}

touchMapLite.prototype.recenterLonLat = function(position){
    var wasZoomed=false;
	lon = position.coords.longitude;
	lat = position.coords.latitude;
	findOnMap.viewerBean.initialPan = { 'x' : findOnMap.lon2pan(lon), 'y' : findOnMap.lat2pan(lat)};
	if(!watchId && position.coords.accuracy){	
		// needs a more sophisticated technique
		zoomLevel = 18-Math.floor(Math.log(position.coords.accuracy));
        if(zoomLevel!=findOnMap.viewerBean.zoomLevel) wasZoomed=true;
		if(zoomLevel>findOnMap.viewerBean.zoomLevel) {
            findOnMap.viewerBean.zoomLevel = zoomLevel; 
        }
	}
	findOnMap.viewerBean.clear();
	findOnMap.viewerBean.init();
	findOnMap.viewerBean.notifyViewerMoved({x:findOnMap.viewerBean.x, y:findOnMap.viewerBean.y});
	if(wasZoomed==true) findOnMap.viewerBean.notifyViewerZoomed();
	if(typeof findOnMap.marker != 'undefined'){
		var home = new findOnMap.marker('GPS',lat, lon,findOnMap,true);
	}
	return false;
}

findOnMap = null;
watchId = false;