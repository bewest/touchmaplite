/*	markers used under the terms of the Creative Commons Attribution licence
 *	http://www.mapito.net/map-marker-icons.html
 */


touchMapLite.prototype.MARKERS = [];


touchMapLite.prototype.placeMarkerHandler = function(){
	coords = this.currentLonLat(this.viewerBean);
	marker = new this.marker('GPS',coords.y, coords.x,this,true);
}


touchMapLite.prototype.getMarkersFormUrlParams = function(){
		if(window.location.href.split('?' )[1]){
			var params = window.location.href.split('?')[1].split('&');
			for(index=0; index<params.length; index++) {  
				keyValue = params[index].split('=');
				if(keyValue[0]=='markers'){
					markers = keyValue[1].split('|');
					for(markersIndex=0; markersIndex < markers.length; markersIndex++) {  
						markerParams = markers[markersIndex].split(',');
							this.MARKERS[markersIndex] = new this.marker(markerParams[2], parseFloat(markerParams[0]), parseFloat(markerParams[1]),this);
					}
				}
			}
		}
}
		

touchMapLite.prototype.marker = function(title, lat, lon, map, live) {
	if(live){
		this.id = 0;
		found = false;
		if(typeof map.MARKERS == 'undefined') map.MARKERS = [];
		for(var id=0; id<map.MARKERS.length; id++){
			if(map.MARKERS[id].title == title && map.MARKERS[id].element){
				document.getElementById('markers').removeChild(map.MARKERS[id].element);
				map.MARKERS[id] = this;
				this.id = id;
				found = true;
				continue;
			}
		}
		if(!found){
			this.id = map.MARKERS.length;
			map.MARKERS[this.id] = this;
		}
	} else {
		this.id = map.MARKERS.length;
		map.MARKERS[this.id] = this;
	}
	this.lon = lon;
	this.lat = lat;
	this.x = 0;
	this.y = 0;	
	this.initialized = false;
	this.map = map;
	this.viewer = map.viewerBean;
	var marker = this;	
	this.viewer.addViewerMovedListener(marker);
	this.viewer.addViewerZoomedListener(marker);
	this.title = title;
	this.isVisible = false;
	this.markerSrc = "images/markers/lightblue"+map.MARKERS.length+".png";
	
	this.createDOMelement();
	this.placeMarker();
	this.updateMarker(this.viewer);

}

touchMapLite.prototype.marker.prototype = {
	
	placeMarker: function(){
		fullSize = this.viewer.tileSize * Math.pow(2, this.viewer.zoomLevel);
		this.x = Math.floor(this.map.lon2pan(this.lon)*fullSize);
		this.y = Math.floor(this.map.lat2pan(this.lat)*fullSize);

	},
	createDOMelement: function(){
		this.element = document.createElement("div");
		this.element.setAttribute("class","marker");
		var image = document.createElement("img");
		image.src=this.markerSrc;
		document.getElementById('markers').appendChild(this.element)
		this.element.appendChild(image)
	
		this.element.marker = this;
		this.element.onclick = function(event){
			this.marker.hideBubbles();
			var bubble = document.createElement("div");
			this.appendChild(bubble);

			bubble.innerHTML = "#"+this.marker.id+": "+this.marker.title+"<br />"+this.marker.lat+",<br />"+this.marker.lon;
			bubble.setAttribute("class","bubble");
			bubble.onmouseup = function(e){
				this.parentNode.marker.hideBubbles();
				return false;
			}
			return false;
		}
	},
	updateMarker: function(e){	
		top = (e.y+this.y);
		left = (e.x+this.x);
		if(top>=0 && top<this.viewer.height && left>=0 && left<this.viewer.width){
			this.element.style.top = top+"px";
			this.element.style.left = left+"px";
			if(!this.isVisible){
				this.isVisible = true;
				this.element.style.display = 'block';
			}
		} else {
			if(this.isVisible){
				this.isVisible = false;
				this.element.style.display = 'none';
			}		
		}
	},

	viewerMoved: function(e){
		this.updateMarker(e);

	},

	viewerZoomed: function(e){
		this.placeMarker();
		this.updateMarker(e);
		this.hideBubbles();


	},

	
	hideBubbles: function(){
		for (var mm = document.getElementById('markers').firstChild; mm; mm = mm.nextSibling) {
			if (mm.className == 'marker'){
				for (var bb = mm.firstChild; bb; bb = bb.nextSibling) {
					if (bb.className == 'bubble'){
						mm.removeChild(bb);
					}
				}
			}
		}	
	}

}
