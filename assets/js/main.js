"use strict";

// SCRIPT SCOPED VARIABLES
let maxRadius = 200;
let invert = false, noise = false, plain = true;
let mainGUI;
let playButton;
let leftButton;
let rightButton;
let seek;
let waveSpace = 0;
let waveRange = 0;
let mousePos = 0;

// 1- here we are faking an enumeration - we'll look at another way to do this soon
const SOUND_PATH = Object.freeze({
  0: "assets/media/crash33-2.wav",
  1: "assets/media/bargain.wav",
  2: "assets/media/bbetc.wav",
  3: "assets/media/goodyou.wav"
});

// const trackList = [ "assets/media/crash33-2.wav", "assets/media/bargain.wav", "assets/media/bbetc.wav", "assets/media/goodyou.wav" ];

// 2 - elements on the page
let audioElement,canvasElement;

// 3 - our canvas drawing context
let drawCtx;

// 4 - our WebAudio context
let audioCtx;

// 5 - nodes that are part of our WebAudio audio routing graph
let sourceNode, analyserNode, gainNode;

// 6 - a typed array to hold the audio frequency data
const NUM_SAMPLES = 256;
// create a new array of 8-bit integers (0-255)
let audioData = new Uint8Array(NUM_SAMPLES/2);

let wb = ["white", "black"];

window.onload = init;

// FUNCTIONS
function init()
{
  setupWebaudio();
  setupCanvas();
  playButton = document.querySelector("#playPause");
  leftButton = document.querySelector("#left");
  rightButton = document.querySelector("#right");
  seek = document.querySelector("#seek");
  mainGUI = new myGUI();
  mainGUI.setupUI();
  update();
}

function setupWebaudio()
{
  // 1 - The || is because WebAudio has not been standardized across browsers yet
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  // 2 - get a reference to the <audio> element on the page
  audioElement = document.querySelector("audio");
  audioElement.src = SOUND_PATH[2];

  // 3 - create an a source node that points at the <audio> element
  sourceNode = audioCtx.createMediaElementSource(audioElement);

  // 4 - create an analyser node
  analyserNode = audioCtx.createAnalyser();

  /*
  We will request NUM_SAMPLES number of samples or "bins" spaced equally
  across the sound spectrum.

  If NUM_SAMPLES (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz,
  the third is 344Hz. Each bin contains a number between 0-255 representing
  the amplitude of that frequency.
  */

  // fft stands for Fast Fourier Transform
  analyserNode.fftSize = NUM_SAMPLES;

  // 5 - create a gain (volume) node
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 1;

  // 6 - connect the nodes - we now have an audio graph
  sourceNode.connect(analyserNode);
  analyserNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // if track ends
  audioElement.onended = e => {
    rightButton.dispatchEvent(new MouseEvent("click"));
    playButton.dispatchEvent(new MouseEvent("click"));
  };
}

function setupCanvas()
{
  canvasElement = document.querySelector('canvas');
  drawCtx = document.querySelector('canvas').getContext("2d");
  canvasElement.addEventListener('mousemove', function(evt)
  {
      mousePos = getMousePos(canvasElement, evt);
  }, false);

  document.querySelector("#fsButton").onclick = _ =>{
    requestFullscreen(canvasElement);
  };
}

function update()
{
  // this schedules a call to the update() method in 1/60 seconds
  requestAnimationFrame(update);

  /*
    Nyquist Theorem
    http://whatis.techtarget.com/definition/Nyquist-Theorem
    The array of data we get back is 1/2 the size of the sample rate
  */

  // populate the audioData with the frequency data
  // notice these arrays are passed "by reference"
  analyserNode.getByteFrequencyData(audioData);

  // OR
  //analyserNode.getByteTimeDomainData(audioData); // waveform data

  // DRAW!
  drawCtx.clearRect(0,0,canvasElement.width,canvasElement.height);
  let barWidth = 10;
  let barSpacing = 5;
  let barHeight = 50;
  let topSpacing = 50;

  waveSpace = (mousePos.x / 1280) * 8;
  waveRange = (mousePos.y / 720) * 255;

  let counterText = 0;
  let lastHigh = 0;

  // loop through the data and draw!
  for(let i=0; i < audioData.length; i++)
  {
    //Top shapes
    drawCtx.beginPath();
    drawCtx.strokeStyle = makeColor(0, 0, 255, 255);
    drawCtx.moveTo(i * (barWidth + barSpacing), canvasElement.height / 2);
    if(audioData[i] > 156)
    {
      drawCtx.lineTo((i + .5) * (barWidth + barSpacing) - (waveSpace * 1), (canvasElement.height / 2) - audioData[i]);
      drawCtx.lineTo((i + .5) * (barWidth + barSpacing) + (waveSpace * 1), (canvasElement.height / 2) - audioData[i]);
    }
    else
    {
      drawCtx.lineTo((i + .5) * (barWidth + barSpacing) + (waveSpace * 1), (canvasElement.height / 2) + audioData[i]);
      drawCtx.lineTo((i + .5) * (barWidth + barSpacing) - (waveSpace * 1), (canvasElement.height / 2) + audioData[i]);
    }

    drawCtx.lineTo((i + 1) * (barWidth + barSpacing), canvasElement.height / 2);
    drawCtx.stroke();

    //Reflections
    drawCtx.beginPath();
    drawCtx.strokeStyle = makeColor(255, 0, 0, 255);
    if(invert) { drawCtx.strokeStyle = makeColor(0, 0, 255, 255); }
    drawCtx.moveTo(i * (barWidth + barSpacing), canvasElement.height / 2);
    if(audioData[i] < 156)
    {
      drawCtx.lineTo((i + .5) * (barWidth + barSpacing) - waveSpace, (canvasElement.height / 2) - audioData[i]);
      drawCtx.lineTo((i + .5) * (barWidth + barSpacing) + waveSpace, (canvasElement.height / 2) - audioData[i]);
    }
    else
    {
      drawCtx.lineTo((i + .5) * (barWidth + barSpacing) + waveSpace, (canvasElement.height / 2) + audioData[i]);
      drawCtx.lineTo((i + .5) * (barWidth + barSpacing) - waveSpace, (canvasElement.height / 2) + audioData[i]);
    }

    drawCtx.lineTo((i + 1) * (barWidth + barSpacing), canvasElement.height / 2);
    drawCtx.stroke();

    // Sun circles
    let percent = audioData[i] / 255;
    let circleRadius = percent * maxRadius + waveRange;

    drawCtx.beginPath();
    drawCtx.fillStyle = makeColor(255, 111, 111, 1);
    drawCtx.arc(canvasElement.width, 0, circleRadius * .5, 0, 2 * Math.PI, false);
    drawCtx.stroke();
    drawCtx.closePath();

    drawCtx.beginPath();
    drawCtx.fillStyle = makeColor(255, 111, 111, 1);
    drawCtx.arc(canvasElement.width, 0, circleRadius * .5, 0, 2 * Math.PI, false);
    drawCtx.stroke();
    drawCtx.closePath();

    // Metronomes
    let counterText = 0;
    let lastHigh = 0;

  }

  manipulatePixels(drawCtx);
}

//Changes each pixel on the canvas to create different visual overlays
function manipulatePixels(ctx)
{
  var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  var data = imageData.data;
  var length = data.length;
  var width = imageData.width;

  let i;
  for(i = 0; i < length; i+=4)
  {
    let red = data[i], green = data[i+1], blue = data[i+2];
    data[i+3] = 255; //alpha

    if(invert)
    {
      data[i] = 255 - red; // set red value
      data[i+1] = 255 - green; // set blue value
      data[i+2] = 255 - blue; // set green value
    }

    if(noise && Math.random() < .10)
    {
      data[i] = data[i + 1] = data[i + 2] = 128; // gray noise
      // data[i] = data[i + 1] = data[i + 2] = 255; // or white noise
      //data[i] = data[i +1] = data[i+2] = 0; // or black noise
    }

    if(plain)
    {
      red = (data[i] * .393) + (data[i + 1] *.769) + (data[i + 2] * .189);
      green = (data[i] * .349) + (data[i + 1] *.686) + (data[i + 2] * .168);
      blue = (data[i] * .272) + (data[i + 1] *.534) + (data[i + 2] * .131);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  if(invert)
  {
    playButton.style.color = "black";
    leftButton.style.color = "black";
    rightButton.style.color = "black";
    fs
    document.querySelector("#trackNum").style.color = "black";
    document.querySelector("#songName").style.color = "black";
    document.querySelector("#credit").style.color = "black";
  }
  else
  {
    playButton.style.color = "white";
    leftButton.style.color = "white";
    rightButton.style.color = "white";
    document.querySelector("#trackNum").style.color = "white";
    document.querySelector("#songName").style.color = "white";
    document.querySelector("#credit").style.color = "white";
  }
}
