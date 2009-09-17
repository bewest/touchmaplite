/**
 * Light JavaScript Viewer for Slippy Map Tiles, (touchMapLite) 0.01
 *
 * Copyright 2009 Gerhard Koch
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Gerhard Koch <gerhard.koch AT ymail.com>
 *
 * TODO: 
 */
 
 touchMapLite = function(domID) {

	this.lon = 0;
	this.lat = 0;
	this.zoom = 0;
	this.defaultMap = 'OSM';
	this.map = this.defaultMap;
	this.tileSources = {};
	this.viewerId = domID;
	this.viewerBean = null;
	this.tileSources = {'OSM': 			new this.TileUrlProviderOSM('http://a.tile.openstreetmap.org','','png'),
						'OSMcylce': 	new this.TileUrlProviderOSM('http://a.andy.sandbox.cloudmade.com/tiles/cycle','','png'),
						'OEPN': 			new this.TileUrlProviderOSM('http://tile.öpnvkarte.de/tilegen','','png'),
						'OSB': 			new this.TileUrlProviderOSM('http://www.openstreetbrowser.org/tiles/base','','png'),
						'GMap': 		new this.TileUrlProviderGMap('http://mt0.google.com','vt/'),
						'GSat': 		new this.TileUrlProviderGMap('http://khm2.google.com','kh/v=43&'),
						'GTopo': 		new this.TileUrlProviderGMap('http://mt2.google.com','vt/v=w2p.106&'),
						'GeobasisBB': 	new this.TileUrlProviderWMS('http://isk.geobasis-bb.de/ows/dnm.php?','bg,siedlung,vegetation,gewaesser,transport,strassennamen,ortsnamen,gewaessernamen','','image/png',false),
						'GaiaMV': 		new this.TileUrlProviderWMS('http://www.gaia-mv.de/dienste/gdimv_dtk?','gdimv_dtk','','image/png',true),
						'NASA':			new this.TileUrlProviderWMS('http://wms.jpl.nasa.gov/wms.cgi?','modis,global_mosaic',',','image/jpeg',true),
						'metacarta':	new this.TileUrlProviderWMS('http://labs.metacarta.com/wms/vmap0?','basic','','image/jpeg')
	};

}

touchMapLite.prototype = {
	init: function(){
		if(typeof this.getPermaFormUrlParams != 'undefined') this.getPermaFormUrlParams();
		this.initializePanoJS();
		if(typeof this.getMarkersFormUrlParams != 'undefined') this.getMarkersFormUrlParams();

	},
	switchSource: function(tileSet){
		if(tileSet && typeof(this.tileSources[tileSet]) != 'undefined'){
			this.map = tileSet;
			this.viewerBean.tileUrlProvider = this.tileSources[tileSet];
			this.viewerBean.clear();
			this.viewerBean.prepareTiles();
		}
	},
	initializePanoJS: function(e) {
		PanoJS.TILE_PREFIX = '';
		PanoJS.MSG_BEYOND_MIN_ZOOM = '';
		PanoJS.MSG_BEYOND_MAX_ZOOM = '';
		PanoJS.USE_SLIDE = false;
		if (this.viewerBean == null) {
			this.viewerBean = new PanoJS(this.viewerId, {
				tileBaseUri: 'http://a.tile.openstreetmap.org',
				tileSize: 256,
				tilePrefix: '',
				tileExtension: 'png',
				maxZoom: 18,
				initialZoom: this.zoom,
				blankTile: 'images/blank.gif',
				loadingTile: 'images/blank.gif',
				initialPan:	{ 'x' : this.lon2pan(this.lon), 'y' : this.lat2pan(this.lat)}
			});
			this.viewerBean.tileUrlProvider = this.tileSources[this.map];
			this.viewerBean.fitToWindow(0);
			this.viewerBean.init();
		
		}
	},
	reinitializeGraphic: function(e) {
		this.viewerBean.resize();
	},
	tile2lon: function(x,z) {
		return (x/Math.pow(2,z)*360-180);
	},
	tile2lat: function (y,z) {
		var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
		return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
	},
	lon2pan: function(lon) {
		return (lon+180)/360;
	},
	lat2pan: function(lat) {
		return (1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 ;
	},
	currentLonLat: function(self) {
		fullSize = self.tileSize * Math.pow(2, self.zoomLevel);
		panx = -self.x/(fullSize - self.width);
		pany = -self.y/(fullSize - self.height);
		lon = panx*360-180;
	  	n=Math.PI-2*Math.PI*pany;
		lat =(180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
		return {x:lon, y:lat}
	}
}