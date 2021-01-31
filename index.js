/* requirements  */
const fs = require('fs');
const os = require('os');
var { Howl, Howler } = require('howler'); //using const causes an error


/* config */
musicfolderpath = __dirname + "/video/"; // ""
exportpath = os.homedir();
fileextregex = RegExp(".mp3|.mpeg|.opus|.ogg|.oga|.wav|.aac|.caf|.m4a|.mp4|.weba|.webm|.dolby|.flac");


/* ==============================================================
                      FUNCTIONS
============================================================== */

/* Intervals  */

function updatefilenames(path) {
  let promfilenames = new Promise((resolve, reject) => {
    fs.readdir(path, {withFileTypes: true}, (err, filenames) => {
      /*
      haven`t found a way to check if there are only files
      i assume all files are music files
      */
      resolve(filenames.map(file => file.name));//with ending
    });
  }).then((filenames) => {
    if(files == filenames){
    } else {//update all songs GUI
      let newfiles = filenames.filter(file => !files.includes(file));
      let removedfiles = files.filter(file => !filenames.includes(file));
      for (var i = 0; i < removedfiles.length; i++) {
        removesongwidgets(removedfiles[i]);
      }
      for (var i = 0; i < newfiles.length; i++) {
        songwidgetcount[newfiles[i]] = 0;
        songwidget(allsongs, newfiles[i]);
      }
    }
    files = filenames;
  })
  .catch(error => console.log(error));
}

function updateslider(){
  if(current_song != null){
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
}


/* Utility  */

function converttimeformat(timesec) {
  if(timesec != 0){
    min = Math.ceil(timesec/60) - 1;
    sec = timesec - (min * 60);
    sep = ":"
    if(sec < 10){
      sep += "0";
    }
    return min.toString() + sep + sec.toString();
  } else {
    return "0:00";
  }
}

function removelastpart(filename, fileending){//with ending 0, without ending 1
  splittedsongid = filename.split(".");
  filen = splittedsongid[0];
  for (let i = 1; (i + fileending) < splittedsongid.length; i++) {
    filen += "." + splittedsongid[i];
  }
  return filen;
}

function exportaszip() {
}

function readplaylistdata(filename){
  fs.readFile(filename, "utf8", (err, data) => {
    //get lines
    var lines = data.split(/\r?\n/);
    lines = lines.filter(line => line != "");
    //write in object
    key = null;
    playlists = {};
    lines.forEach((item) => {
      if(item.slice(0,1) == "#"){//sign for a playlist
        if(!playlists.hasOwnProperty(item.slice(1))){
          playlists[item.slice(1)] = [];
        }
        key = item.slice(1);//the following belong to this playlist(key) until the next #
      } else if(key != null) {
        if(!(playlists[key].includes(item))){
          playlists[key].push(item);
        }
      } else{
        //some idiot put lines at the start
      }
    });
    //console.log(playlists); //debug xD
  });
}

/* GUI  */

function songwidget(parent, songname, adding=""){
  let songdiv = document.createElement("div");
  songdiv.id = songname + adding;
  songdiv.className = "song-widget";
  //append events
  songdiv.draggable = true;
  songdiv.ondragstart = dragstart;
  songdiv.ondragover = dragover;
  songdiv.ondrop = droponsong;
  //title
  let songtitle = document.createElement("span");
  songtitle.innerHTML = removelastpart(songname, 1);
  songtitle.style.color = "white";
  //image
  let kebabmenu = document.createElement("img");
  kebabmenu.src = "images/kebabmenu.png";
  //append elements
  songdiv.appendChild(songtitle);
  songdiv.appendChild(kebabmenu);
  parent.appendChild(songdiv);
}

function removesongwidgets(songname){
  document.getElementById(songname).remove();
  for(let i = 1; i < songwidgetcount + 1; i++){
    document.getElementById(songname + "." + (i).toString()).remove();
  }
}

/* events for drag and drop  */

function dragover(ev) {
  ev.preventDefault(); //normally you can`t drop an element into another
}

function dragstart(ev) {
  ev.dataTransfer.setData("id", ev.target.id);
}

function droponplay(ev, self) {
  ev.preventDefault(); //default ondrop is open as link
  if(ev.target == self){//only when directly dropped on this
    var elid = ev.dataTransfer.getData("id");
    if(document.getElementById(ev.dataTransfer.getData("id")).parentNode.className == "playlist"){
      //dropped from a playlist
      if(files.includes(elid)){
        songwidgetcount[elid] += 1;
        idwithoutending = elid;
      } else {
          var idwithoutending = removelastpart(elid, 1);
          songwidgetcount[idwithoutending] += 1;
      }
      var adding = "." + (songwidgetcount[idwithoutending]).toString();
      songwidget(playqueqediv, idwithoutending, adding);//append as last to target element
      var removefromplayqueqe = false;

    } else {
      //dropped from playqueqe
      //no need to make a new element, just append at end
      var songwidgettomove = document.getElementById(elid);
      songwidgettomove.parentNode.appendChild(songwidgettomove);
      var removefromplayqueqe = true;
    }
    if(removefromplayqueqe){
      // TODO: Remove
    }
    //add to queqe
    queqe.addsong(elid + adding);
  }
}

function droponsong(ev){
  ev.preventDefault();
  //get song div which is the target
  if(ev.target.tagName != "DIV"){
    var target = ev.target.parentNode;
  } else {
    var target = ev.target;
  }
  //
  var elid = ev.dataTransfer.getData("id");

  if(document.getElementById(elid).parentNode.className == "playlist"){
    if(target.parentNode.className == "playlist"){
      var songwidgettomove = document.getElementById(elid);
      target.parentNode.insertBefore(songwidgettomove, target.nextSibling);

    } else {//is dropped on a song in playqueqe
      if(files.includes(elid)){
        songwidgetcount[elid] += 1;
      } else {
          var idwithoutending = removelastpart(elid, 1);
          songwidgetcount[idwithoutending] += 1;
      }

      var adding = "." + (songwidgetcount[idwithoutending]).toString();
      songwidget(playqueqediv, idwithoutending, adding);
      target.parentNode.insertBefore(document.getElementById(idwithoutending + adding), target.nextSibling); //append after target element

      // TODO: Add to playqueqe

    }
  } else {//playqueqe
    if(target.parentNode.className == "play-song-display"){
      var songwidgettomove = document.getElementById(elid);
      target.parentNode.insertBefore(songwidgettomove, target.nextSibling);

      // TODO: Change position

    } else {//is droppend on a song in a playlist
      // TODO: Add it to playlist
    }
  }
}


/* ==============================================================
                      CLASSES
============================================================== */


// plays the current song and makes pause usw. possible
// there will only one song, the current song that is played
// wrapped Howl methods in my own class

function song(filename){
  //init
  previoustime = 0;
  progressslider[0].value = 0;
  this.song = new Howl({
    src: [filename]
  }).once('load', () => {
    //get duration and set range slider
    this.duration = this.song._duration;
    timeright.innerHTML = converttimeformat(Math.ceil(this.duration));
    progressslider[0].max = Math.ceil(this.duration);
    current_song.playpauseresume();
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


// queqe class to bundle all queqe functions
function queqe(){
  //init
  this.playqueqe = [];
  this.currentindex = 0;
  this.loopatend = false;
  this.randomplayatend = false;

  //basic methods
  //play
  this.setsongcurrentindex = () => {
    if(current_song != null){
      current_song.song.unload();
    }
    current_song = new song(musicfolderpath + this.currentsongname(false));
  }

  //queqe manipulation
  this.addsong = (song, index) => {
    if(index){
      this.playqueqe.splice(song, 0, index);
      if(index <= this.currentindex){
        this.currentindex += 1;
      }
    } else {
      this.playqueqe.push(song);
    }
  }

  this.appendlist = (list) => {
    for (let i = 0; i < list.length; i++) {
      this.playqueqe.push(list[i]);
    }
  }

  this.removesong = (songname, index, all) => {
    if(all){
      var removedbeforecurrentindex = 0;
      let newqueqe = this.playqueqe.filter((song, i) => {
        if(song != songname){
          return true;
        } else {
          if(i < this.currentindex){
            removedbeforecurrentindex += 1;
          } else if(i == this.currentindex){
            //play next song
          }
          return false;
        }
      });
      this.currentindex -= removedbeforecurrentindex;
      this.playqueqe = newqueqe;

    } else {
      if(index < this.currentindex){
        this.currentindex -= 1;
      } else if(index == this.currentindex){
        //play next song
      }
      this.playqueqe.splice(index, 1);
    }
  }

  this.clearqueqe = (removecurrentsong) => {
    if(removecurrentsong){
      current_song.unload();
      current_song = null;
    }
    this.playqueqe = [];
  }

  //info
  this.currentsongname = (id) => {
    if(id){
      return this.playqueqe[this.currentindex];
    } else {
      return removelastpart(this.playqueqe[this.currentindex], 1);
    }
  }

  this.remainingsongs = () => {
    //excludes current song
    return [this.playqueqe.length - this.currentindex - 1, this.playqueqe.slice(this.currentindex + 1)];
  }

  this.previoussongs = () => {
    return [this.currentindex, this.playqueqe.slice(0, this.currentindex)];
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

allsongs = document.getElementById("allsongs");
playqueqediv = document.getElementsByClassName("play-song-display")[0];

/* variables  */
current_song = null;
songwidgetcount = {}
queqe = new queqe();


//get plalists
//playlists = readplaylistdata("playlists.txt");

//get files
files = [];
updatefilenames(musicfolderpath);


/* ==============================================================
                      INTERVALS
============================================================== */


//update slider
previoustime = 0;
setInterval(updateslider, 500);

//update files in directory
setInterval(updatefilenames, 5000, musicfolderpath);

//update playlists


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
  if(queqe.currentindex != 0){
    queqe.currentindex -= 1;
    queqe.setsongcurrentindex();
  }
});

playbutton.addEventListener('click', () => {
  Howler.volume(0.1);
  if(current_song == null && queqe.playqueqe.length != 0){
    queqe.setsongcurrentindex();
  } else if(current_song != null){
    current_song.playpauseresume();
  } else {
  }
});

nextbutton.addEventListener('click', () => {
  if(queqe.currentindex != queqe.playqueqe.length - 1){
    queqe.currentindex += 1;
    queqe.setsongcurrentindex();
  }
});

randombutton.addEventListener('click', () => {

});
