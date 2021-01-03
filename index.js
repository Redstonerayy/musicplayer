/* requirements  */
const fs = require('fs');
var { Howl, Howler } = require('howler'); //using const causes an error

/* config */
musicfolderpath = "";
exportpath = "";


/* ==============================================================
                      FUNCTIONS
============================================================== */


// TODO: play, pause, resume, volume, loop, random



/* ==============================================================
                      CLASSES
============================================================== */


// plays the current song and makes pause usw. possible
// there will only one song, the current song that is played
// wrapped Howl methods in my own class

function song(filename, slider){
  //init
  this.song = new Howl({
    src: [filename]
  }).on('load', () => {
    //get duration and set range slider
    this.duration = this.song._duration;
    if(slider){
      progressslider[0].max = Math.ceil(this.duration);
    }
  });

  //methods
  this.playpauseresume = () => {
    if(!current_song.song.playing()){
      this.song.play();
    } else {
      this.pause(false);
    }
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
exportbutton = document.getElementById('export');
loopbutton = document.getElementById('loop');
previousbutton = document.getElementById('previous');
playbutton = document.getElementById('pause-resume-play');
nextbutton = document.getElementById('next');
randombutton = document.getElementById('random');
progressslider = document.getElementsByClassName('slider-play-control');

/* variables  */
current_song = new song("hateme.mp4", true);


/* ==============================================================
                      CLICK EVENT LISTENERS
============================================================== */


exportbutton.addEventListener('click', () => {
  exportaszip();
});

/* control bar  */

loopbutton.addEventListener('click', () => {
  current_song.loop(true);
});

previousbutton.addEventListener('click', () => {

});

playbutton.addEventListener('click', () => {
  //Howler.volume(0.1);
  current_song.playpauseresume();
});

nextbutton.addEventListener('click', () => {

});

randombutton.addEventListener('click', () => {

});
