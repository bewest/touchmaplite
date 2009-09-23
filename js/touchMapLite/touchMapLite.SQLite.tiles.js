touchMapLite.tileSources = {};

touchMapLite.prototype.SQLite.tiles = function(db,map,id, url,regex) {
	this.db = db;
	this.map = map;
	this.url = url;
	this.regex = regex;
	this.id = id;
	this.init();
}


touchMapLite.prototype.SQLite.tiles.prototype = {
	assembleUrl: function(xIndex, yIndex, zoom) {
			url = this.url.replace(/\{Z\}/g, zoom);
			url = url.replace(/\{X\}/g, xIndex);
			url = url.replace(/\{Y\}/g, yIndex);
			return url;
	},


	init: function() {
		if(this.db){
			this.db.transaction(function(tx) {

				tx.executeSql("SELECT COUNT(*) FROM tiles", [], function(tx, result) {
				// count;
				}, function(tx, error) {
				tx.executeSql("CREATE TABLE tiles (provider TEXT, x INT, y INT, z INT, timestamp REAL, data BLOB)", [], function(result) { 
				// count; 
				});
				});
			 });
			this.map.viewerBean.createPrototype = this.createPrototype;
		}

	},

    writeTileToCache: function(x,y,z,data,image)
    {
		var tileSQL = new Object;

		tileSQL.provider = this.id;
		tileSQL.x = x;
		tileSQL.y = y;
		tileSQL.z = z
		tileSQL.timestamp = 0;
		tileSQL.data = data;
        
        this.db.transaction(function (tx) 
        {
            tx.executeSql("INSERT INTO tiles (provider, x, y, z, timestamp, data) VALUES (?, ?, ?, ?, ?, ?)", [tileSQL.provider, tileSQL.x, tileSQL.y, tileSQL.z, tileSQL.timestamp, tileSQL.data]);
        }); 
        
    },
    populateCache: function(image,z,x,y,src)
    {
		
		var tileSQL = new Object;
		
		tileSQL.x = x;
		tileSQL.y = y;
		tileSQL.z = z;
		tileSQL.tiles = this;
		tileSQL.image = image;
		
// proxy method

/*		getreq('http://geo.dmachine.de/proxy/base64/?'+src, function(request){
			if (request.readyState != 4){ return; }
			tileSQL.tiles.writeTileToCache(tileSQL.x,tileSQL.y,tileSQL.z,request.responseText,image);
		});
*/
		// using canvas toDataURL method to generate base64 string
		image.src=src;
		image.onload = function(){
			data = tileSQL.tiles.getBase64Image(tileSQL.image);
			tileSQL.tiles.writeTileToCache(tileSQL.x,tileSQL.y,tileSQL.z, data, tileSQL.image);
		}
    },
    // from http://stackoverflow.com/questions/934012/get-image-data-in-javascript
    getBase64Image: function (img) {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		return canvas.toDataURL("image/png");
		
	},
    
    fetchTileFromCache: function(image,z,x,y,src)
    {
		var tileSQL = new Object;
		
		tileSQL.image = image;
		tileSQL.provider = this.id;
		tileSQL.x = x;
		tileSQL.y = y;
		tileSQL.z = z;
		tileSQL.src = src;
		tileSQL.tiles = this;

		if(this.db){ //  && document.getElementById('cache') && document.getElementById('cache').checked
	       this.db.transaction(function (tx) 
    	    {
				tx.executeSql("SELECT data FROM tiles WHERE provider = ? AND x = ? AND y = ? AND z = ?", [tileSQL.provider, tileSQL.x, tileSQL.y, tileSQL.z], function(tx, result) {
					if(!result.rows.length){
						tileSQL.tiles.populateCache(image,tileSQL.z,tileSQL.x,tileSQL.y,tileSQL.src);
					} else {
						 for (var i = 0; i < result.rows.length; ++i) {
							var row = result.rows.item(i);
							image.src = row.data;
							image.relativeSrc = image.src;  
						 }
					}
				}, function(tx, error) {
					tileSQL.tiles.populateCache(image,tileSQL.z,tileSQL.x,tileSQL.y,tileSQL.src);
				});
        	}); 
        } else {
	        image.src = src; 
    	    image.relativeSrc = image.src;        
        }
        
    },
    
	resolveTile: function(image, src) {
		var tile = this.regex;
  		if(tile.test(src)){
			tile.exec(src);
	  		this.fetchTileFromCache(image,RegExp.$1,RegExp.$2,RegExp.$3,src);
	  	} else {
	  		image.src = src;
	  		image.relativeSrc = src;		
	  	}
	},
	createPrototype: function(src) {
		var img = document.createElement('img');
		if(this.touchMap.viewerBean.tileUrlProvider.resolveTile) {
			this.touchMap.viewerBean.tileUrlProvider.resolveTile(img, src);
		} else {
			touchMap.sqlTiles.resolveTile(img, src);
		}
		img.className = 'tile'; // touchMap.viewerBean.TILE_STYLE_CLASS;
		img.style.width = '256px'; //touchMap.viewerBean.tileSize + 'px';
		img.style.height = '256px'; // touchMap.viewerBean.tileSize + 'px';
		return img;
	}

}

/*
 function createXMLHttpRequest() {
   try { return new XMLHttpRequest(); } catch(e) {}
   try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
   try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
   alert("XMLHttpRequest not supported");
   return null;
 }

function getreq ( url, callback )
{
	var req = createXMLHttpRequest();
	if ( !req ) {
		alert( "Error initializing XMLHttpRequest!" );
		return;
	}
	req.open( "GET", url, true );
	req.onreadystatechange = function () { callback( req ) };
	req.send( null );
}
*/