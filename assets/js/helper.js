// HELPER FUNCTIONS
function makeColor(red, green, blue, alpha){
    var color='rgba('+red+','+green+','+blue+', '+alpha+')';
    return color;
}

function changeTrack(direction)
{
  if(direction == 0) { trackIndex--; }
  else { trackIndex++; }
  if(trackIndex<0) { trackIndex = 3; }
  if(trackIndex>3) { trackIndex = 0; }
  try { audioElement.src = SOUND_PATH[trackIndex]; }
  catch (e) {  audioCtx.resume(); }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function secondsToHms(d) {
    d = Number(d);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return mDisplay + sDisplay;
}

function requestFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullscreen) {
    element.mozRequestFullscreen();
  } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
  // .. and do nothing if the method is not supported
};
