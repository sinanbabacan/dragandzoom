window.dragandzoom = (function(){

  var constructor =  function(img, options){

    var defaults = {
    		zoom_ratio: 0.04,
        wheel_zoom: true
    	};

    var settings = {};
    
    Object.keys(defaults).forEach(function(key){
      settings[key] = options[key] !== undefined ? options[key]: defaults[key];
    });

    function updateBackgroundImage(){
      img.style.backgroundSize = bx+'px '+by+'px';
      img.style.backgroundPosition = px + 'px '+ py +'px';
    }

    function onMousemove(e){

      var fx = e.x - img.getBoundingClientRect().left - document.body.scrollLeft;
      var fy = e.y - img.getBoundingClientRect().top - document.body.scrollTop;

      var dif_x = fx - down_cursor_x;
      var dif_y = fy - down_cursor_y;

      px = down_px + dif_x;
      py = down_py + dif_y;

      updateBackgroundImage();
    }

    function preventAction(x, y){
      var result = false;

      if (px > x) {
        result = true;
      }
      if (py > y) {
        result = true;
      }
      if (x > bx + px) {
        result = true;
      }
      if(y > by + py){
        result = true;
      }

      return result;
    }

    function onWheel(e){
      e.preventDefault();

      if (!settings.wheel_zoom) {
        return;
      }

      var cx = 0;
      var cy = 0;

      var cursor_x = e.pageX - img.getBoundingClientRect().left - document.body.scrollLeft;
      var cursor_y = e.pageY - img.getBoundingClientRect().top - document.body.scrollTop;

      if(preventAction(cursor_x, cursor_y)){
        return;
      }

      var ax = cursor_x - px;
      var ay = cursor_y - py;

      if (e.deltaY < 0) {
        cx = bx + bx * settings.zoom_ratio;
				cy = by + by * settings.zoom_ratio;
			} else {
				cx = bx - bx * settings.zoom_ratio;
				cy = by - by * settings.zoom_ratio;
			}

      var dx = cx * ax / bx;
      var dy = cy * ay / by;

      px = cursor_x - dx;
      bx = cx;
      py = cursor_y - dy;
      by = cy;

      updateBackgroundImage();
    }

    function onMousedown(e){
      e.preventDefault();

      down_cursor_x = e.x - img.getBoundingClientRect().left - document.body.scrollLeft;
      down_cursor_y = e.y - img.getBoundingClientRect().top - document.body.scrollTop;
      down_px = px;
      down_py = py;

      if(preventAction(down_cursor_x, down_cursor_y)){
        return;
      }

      img.style.cursor = 'move';
      img.addEventListener('mousemove', onMousemove);
      img.addEventListener('mouseup', onMouseup);
      img.addEventListener('mouseout',onMouseout);
    }

    function onMouseout(e){
      e.preventDefault();
      removeEvents();
    }

    function onMouseup(e){
      e.preventDefault();
      removeEvents();
    }

    function removeEvents(){

      down_cursor_x = 0;
      down_cursor_y = 0;

      img.style.cursor = 'default';
      img.removeEventListener('mousemove', onMousemove);
      img.removeEventListener('mouseup',onMouseup);
      img.addEventListener('mouseout',onMouseout);
    }

    var px = 0;
    var py = 0;
    var down_cursor_x = 0;
    var down_cursor_y = 0;
    var down_px = 0;
    var down_py = 0;
    var bx = 0;
    var by = 0;

    function imageLoadComplete(){
      bx = img.naturalWidth;
      by = img.naturalHeight;
      img.style.backgroundImage = "url('"+img.src+"')";
      img.style.backgroundRepeat = 'no-repeat';
      img.style.backgroundPosition = '0 0';
      img.src = document.createElement('canvas').toDataURL();
      img.addEventListener('wheel', onWheel);
      img.addEventListener('mousedown', onMousedown);
    }

    if(img.complete){
      imageLoadComplete();
    }else {
      function onload() {
        img.removeEventListener('load', onload);
        imageLoadComplete();
      }
      img.addEventListener('load', onload);
    }
  }

  return function(imgElements, options){

    if (imgElements && imgElements.length) {
      Array.prototype.forEach.call(imgElements, function(imgElement){
        constructor(imgElement, options);
      });
    }
    else if(imgElements && imgElements.nodeName){
      constructor(imgElements, options);
    }

    return imgElements;
  }

}());