"use strict"

let gui;
let tracklist = SOUND_PATH;
let trackIndex = 2;
let maxTracks = 3;
let trackNum = document.querySelector("#trackNum");
let songName = document.querySelector("#songName");
let fxIndex = 0;

class myGUI
{
  constructor()
  {
    // this.gui = new dat.GUI();
    updateTrack();
  }

  setupUI()
  {
    playButton.onclick = e =>
    {
      // check if context is in suspended state (autoplay policy)
      if (audioCtx.state == "suspended")
      {
        audioCtx.resume();
      }

      if (e.target.dataset.playing == "no")
      {
        audioElement.play();
        e.target.dataset.playing = "yes";
        e.target.name = "pause"
      }
      // if track is playing pause it
      else if (e.target.dataset.playing == "yes")
      {
        audioElement.pause();
        e.target.dataset.playing = "no";
        e.target.name = "play";
      }

      updateTrack();
    };

    canvasElement.onclick = e =>
    {
      fxIndex++;
      switch(fxIndex)
      {
        case 0:
          plain = true;
          break;
        case 1:
          plain = false;
          invert = true;
          break;
        case 2:
          invert = false;
          noise = true;
          break;
        case 3:
          noise = false;
          plain = true;
          fxIndex = 0;
          break;
      }
    }

    leftButton.onclick = e =>
    {
      trackIndex--;
      if(trackIndex < 0) { trackIndex = 3; }
      audioElement.src = tracklist[trackIndex];
      if(playButton.dataset.playing == "yes") {
        playButton.dispatchEvent(new MouseEvent("click"));
        playButton.dispatchEvent(new MouseEvent("click"));
      }

      updateTrack();
    }

    rightButton.onclick = e =>
    {
      trackIndex++;
      if(trackIndex > 3) { trackIndex = 0; }
      audioElement.src = tracklist[trackIndex];
      if(playButton.dataset.playing == "yes") {
        playButton.dispatchEvent(new MouseEvent("click"));
        playButton.dispatchEvent(new MouseEvent("click"));
      }

      updateTrack();
    }
  }

  createDatGUI()
  {
    let input = new Settings();

    gui.add(input, "Tracks", trackList);
    gui.add(input, "Volume", 0, 100);
  }


}

// window.onload = function()
// {
//   let input = new Settings();
//   // input = gui.addFolder("Music");
//
//   gui.add(input, "Tracks", trackList);
//   gui.add(input, "Volume", 0, 100);
//
//   // var text = new FizzyText();
//   // gui.add(text, 'message');
//   // gui.add(text, 'speed', -5, 5);
//   // gui.add(text, 'displayOutline');
//   // gui.add(text, 'explode');
// };

let updateTrack = function()
{
  trackNum.innerHTML = trackIndex + " / " + maxTracks;
  let song = SOUND_PATH[trackIndex];
  song = song.substring(13, song.length);
  songName.innerHTML = song;
}

let Settings = function()
{
  // Settings - track select
  // Visual FX
  // Audio FX

  this.Tracks = trackList[0];
  this.Volume = 50;

  // <label>Track:
  //   <select id="trackSelect">
  //     <option value="assets/media/bbetc.wav" selected>better better etc.</option>
  //     <option value="assets/media/bargain.wav">bargain bin</option>
  //     <option value="assets/media/crash33-2.wav">crash33-2.wav</option>
  //     <option value="assets/media/goodyou.wav">good and you?</option>
  //   </select>
  // </label>
}

var vfx = function()
{
  // this.CircleRadius = 0;
  // this.invert = false;
  // this.tintRed = false;
  // this.noise = false;
  // this.sepia = false;

  // <label>VFX Filter:
  //   <select id="vfx">
  //     <option value="red" selected>Tint Red</option>
  //     <option value="sepia">Sepia</option>
  //     <option value="noise">Noise</option>
  //   </select>
  // </label>
}

let afx = function()
{

}

// let volumeSlider = document.querySelector("#volumeSlider");
// volumeSlider.oninput = e => {
//   gainNode.gain.value = e.target.value;
//   volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
// };
// volumeSlider.dispatchEvent(new InputEvent("input"));
//
// let circleSlider = document.querySelector("#circleSlider");
// circleSlider.oninput = e => {
//   maxRadius = e.target.value;
//   circleLabel.innerHTML = maxRadius;
// };
// circleSlider.dispatchEvent(new InputEvent("input"));


// document.querySelector("#trackSelect").onchange = e =>{
//   audioElement.src = e.target.value;
//   // pause the current track if it is playing
//   playButton.dispatchEvent(new MouseEvent("click"));
//   };
//
// document.querySelector("#vfx").onchange = e =>
// {
//   audioElement.src = e.target.value;
//   // pause the current track if it is playing
//   playButton.dispatchEvent(new MouseEvent("click"));
// };

// document.querySelector("#fullscreen").onclick = _ =>{
//   requestFullscreen(canvasElement);
// };
