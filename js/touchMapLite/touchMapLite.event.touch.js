function touchHandler(event)
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
			event.y == lastTouchEventBeforeLast.y){
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
		lastTouchEvent.date = new Date();;

		if (event.preventDefault) event.preventDefault();
    } else {
    
		if(event.scale>1) viewerBean.zoom(1);
		if(event.scale<1) viewerBean.zoom(-1);

		if (event.preventDefault) event.preventDefault();
		
    }
}


var touchArea = document.getElementById('touchArea');
var lastTouchEvent = false;
var lastTouchEventBeforeLast = false;
var touchDate = false;

if(touchArea){
	EventUtils.addEventListener(touchArea, 'touchstart', touchHandler, true);
	EventUtils.addEventListener(touchArea, 'touchmove', touchHandler, true);
	EventUtils.addEventListener(touchArea, 'touchend', touchHandler, true);
	EventUtils.addEventListener(touchArea, 'touchcancel', touchHandler, true);
}
/*
function gestureHandler(event){

}		
		
EventUtils.addEventListener(touchArea, "gesturestart", gestureHandler, false);
EventUtils.addEventListener(touchArea, "gesturechange", gestureHandler, false);
EventUtils.addEventListener(touchArea, "gestureend", gestureHandler, false);
*/