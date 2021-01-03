/* requirements  */
const fs = require('fs');
const os = require('os');
var { Howl, Howler } = require('howler'); //using const causes an error


/* config */
musicfolderpath = __dirname; // ""
exportpath = os.homedir();
fileextregex = RegExp(".mp3|.mpeg|.opus|.ogg|.oga|.wav|.aac|.caf|.m4a|.mp4|.weba|.webm|.dolby|.flac");


/* ==============================================================
                      FUNCTIONS
============================================================== */


function updatefilenames(path) {
  let temp = []
  fs.readdir(path, {withFileTypes: true}, (err, filesnames) => {
    filenames.forEach((item) => {
      fs.stat(item["name"], (err, stats) => {
        if(stats.isFile()){
          if(fileextregex.test(item["name"])){
            files.push(item["name"]);
          }
        }
      });
    });
  });
  files = temp;
}


function updateslider(){
  slidervalue = progressslider[0].value;
  if(slidervalue != previoustime){
    current_song.settime(slidervalue)
    previoustime = slidervalue;
  } else {
    songtime = Math.round(current_song.gettime());
    progressslider[0].value = songtime;
    previoustime = songtime;
  }
  timeleft.innerHTML = converttimeformat(previoustime);
}

function converttimeformat(timesec) {
  if(timesec != 0){
    min = Math.ceil(timesec/60) - 1;
    sec = timesec - (min * 60);
    return min.toString() + ":" + sec.toString();
  } else {
    return "0:00";
  }
}

function exportaszip() {

}


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

    timeright.innerHTML = converttimeformat(Math.ceil(this.duration));
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

  this.gettime = () => {
    return this.song.seek();
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
timeleft = document.getElementById('time-left');
timeright = document.getElementById('time-right');


/* variables  */
current_song = new song("hateme.mp4", true);
previoustime = 0;
files;
getfilenames(musicfolderpath);
setInterval(updateslider, 250);
setInterval(updatefilenames, 5000, musicfolderpath);


/* ==============================================================
                      CLICK EVENT LISTENERS
============================================================== */


/* export as zip  */

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
