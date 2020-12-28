/* requirements  */
const fs = require('fs');
var { Howl, Howler } = require('howler'); //using const causes an error

/* config */
musicfolderpath = "";
exportpath = "";


/* ==============================================================
                      FUNCTIONS
============================================================== */


// TODO: play, pause, resume, volume, loop, random, timestamp, songtext



/* ==============================================================
                      CLASSES
============================================================== */


// plays the current song and makes pause usw. possible
// there will only one song, the current song that is played
// wrapped Howl methods in my own class
function song(filename){
  this.song = new Howl({
    src: [filename]
  });
  this.duration = this.song.duration();

  //methods
  this.playorresume = () => {
    this.song.once('load', () => {
      this.song.play();
    });
  }

  this.pause = (reset) => {
    if(reset){
      this.song.stop();
    } else {
      this.song.pause();
    }
  }

  this.mute = (mute) => { // true -> mute; false -> unmute
    this.song.mute(mute);
  }

  this.loop = (loop) => { // true -> loop; false -> unloop
    this.song.loop(loop);
  }

  this.setvolume = (volume) => { //0.0 - 1.0
    this.song.volume(volume);
  }

  this.setrate = (rate) => { //0.5 - 4.0
    this.song.rate(rate);
  }

  this.settime = (seconds) => {
    this.song.seek(seconds);
  }
}


/* ==============================================================
                      APP
============================================================== */


/* dump  */
button = document.getElementById('export');




button.addEventListener('click', () => {
  var sound = new Howl({
    src: ['hateme.mp4']
  });
  sound.play();
  Howler.volume(0.1);
});
