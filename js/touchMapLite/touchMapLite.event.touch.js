/*
 *	code fragments from http://rossboucher.com/2008/08/19/iphone-touch-events-in-javascript/
 */

touchHandler = function(event)
{
//	event.preventDefault()
    var touches = event.changedTouches,
        first = touches[0],
        type = '';
    if(touches.length==1){

		switch(event.type)
		{
			case 'touchstart': type = 'mousedown'; break;
			case 'touchmove':  type='mousemove'; break;        
			case 'touchend':   type='mouseup'; break;
			default: return;
		}
		
		
		if(event.type == 'touchend' && lastTouchEventBeforeLast.type == 'touchend' &&
			event.x == lastTouchEventBeforeLast.x &&
			event.y == lastTouchEventBeforeLast.y &&
            lastTouchEvent.touches.length==0){
			if(lastTouchEventBeforeLast.date){
				event.date = new Date();
				diff = event.date.getSeconds()*1000+event.date.getMilliseconds()-
				(lastTouchEventBeforeLast.date.getSeconds()*1000+lastTouchEventBeforeLast.date.getMilliseconds());
				if(diff<500){
					lastTouchEventBeforeLast.date = false;
					lastTouchEvent.date = false;
					type='dblclick';
				}
			}
		}

		var simulatedEvent = document.createEvent('MouseEvent');
		simulatedEvent.initMouseEvent(type, true, true, window, 1, 
								  first.screenX, first.screenY, 
								  first.clientX, first.clientY, false, 
								  false, false, false, 0/*left*/, null);
																				
		first.target.dispatchEvent(simulatedEvent);

		lastTouchEventBeforeLast = lastTouchEvent;
		lastTouchEvent = event;
		lastTouchEvent.date = new Date();
    } else if (touches.length==2) {
        if (pinchStartScale==false) {
            pinchStartScale = touchMap.viewerBean.zoomLevel;
        } 
        if (event.scale>1 && event.scale*pinchStartScale-touchMap.viewerBean.zoomLevel>1)
            touchMap.viewerBean.zoom(1);        
        if (event.scale<1 && touchMap.viewerBean.zoomLevel-event.scale*pinchStartScale>1)
            touchMap.viewerBean.zoom(-1);
    } 
    if(event.type == 'touchend') {
        pinchStartScale = false;
	}
	if (event.preventDefault) event.preventDefault();
}


var touchArea = document.getElementById('touchArea');
var lastTouchEvent = false;
var lastTouchEventBeforeLast = false;
var touchDate = false;
var pinchStartScale = false;

if(touchArea){
	EventUtils.addEventListener(touchArea, 'touchstart', touchHandler, true);
	EventUtils.addEventListener(touchArea, 'touchmove', touchHandler, true);
	EventUtils.addEventListener(touchArea, 'touchend', touchHandler, true);
	EventUtils.addEventListener(touchArea, 'touchcancel', touchHandler, true);
	EventUtils.addEventListener(touchArea, 'gestureend', touchHandler, true);
}
/*
function gestureHandler(event){

}		
		
EventUtils.addEventListener(touchArea, "gesturestart", gestureHandler, false);
EventUtils.addEventListener(touchArea, "gesturechange", gestureHandler, false);
EventUtils.addEventListener(touchArea, "gestureend", gestureHandler, false);
*/
